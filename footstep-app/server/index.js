require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });

app.use(cors());
app.use(express.json());

// Init DB
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS electricity (
      id SERIAL PRIMARY KEY,
      value INTEGER NOT NULL DEFAULT 0
    );
  `);
  const { rows } = await pool.query('SELECT COUNT(*) FROM electricity');
  if (parseInt(rows[0].count) === 0) {
    await pool.query('INSERT INTO electricity (value) VALUES (0)');
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
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
