-- Footsteps to Electricity Database Schema
-- Run this once on your Railway PostgreSQL instance
-- (or let the server auto-init on first boot)

CREATE TABLE IF NOT EXISTS electricity (
  id SERIAL PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial row if table is empty
INSERT INTO electricity (value) 
SELECT 0 
WHERE NOT EXISTS (SELECT 1 FROM electricity);
