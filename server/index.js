// Load .env only if file exists (for local dev)
// On Railway, env vars come from the dashboard
try {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
} catch (err) {
  // File doesn't exist, that's okay - Railway will provide env vars
}

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();

// Parse DATABASE_URL safely
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ ERROR: DATABASE_URL environment variable not set!');
  console.error('\nLocal Dev Fix:');
  console.error('  1. Create .env in project root with DATABASE_URL=...');
  console.error('  2. Make sure it matches schema.sql');
  console.error('\nRailway Fix:');
  console.error('  1. Go to Railway dashboard');
  console.error('  2. Add PostgreSQL service');
  console.error('  3. Click "Connect" and copy the DATABASE_URL');
  console.error('  4. Set it as an environment variable in your app service');
  process.exit(1);
}

const pool = new Pool({ 
  connectionString: dbUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Add a shorter connection timeout for development
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

app.use(cors());
app.use(express.json());

// Init DB with better error handling
async function initDB() {
  try {
    // Test connection
    const testRes = await pool.query('SELECT NOW()');
    console.log('✓ Database connected at', testRes.rows[0].now);
    
    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS electricity (
        id SERIAL PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0
      );
    `);
    console.log('✓ Electricity table created/exists');
    
    // Check if data exists
    const { rows } = await pool.query('SELECT COUNT(*) FROM electricity');
    if (parseInt(rows[0].count) === 0) {
      await pool.query('INSERT INTO electricity (value) VALUES (0)');
      console.log('✓ Initialized electricity counter to 0');
    } else {
      console.log('✓ Electricity counter exists');
    }
  } catch (error) {
    console.error('Database initialization error:', error.message);
    console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    throw error;
  }
}

app.get('/electricity', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT value FROM electricity WHERE id = 1');
    res.json({ electricity: rows[0]?.value ?? 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/generate', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE electricity SET value = value + 1 WHERE id = 1 RETURNING value'
    );
    res.json({ electricity: rows[0].value });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Serve React in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

const PORT = process.env.PORT || 4000;

// Start server with proper error handling
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${PORT}`);
      console.log(`  API: GET  /electricity`);
      console.log(`  API: POST /generate\n`);
    });
  })
  .catch(error => {
    console.error('\n✗ Failed to start server:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check DATABASE_URL in .env is valid');
    console.error('2. Ensure PostgreSQL server is running');
    console.error('3. For local dev: createdb footsteps && psql footsteps < schema.sql');
    process.exit(1);
  });
