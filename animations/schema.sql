-- Run this once on your Railway PostgreSQL instance
-- (or let the server auto-init on first boot)

CREATE TABLE IF NOT EXISTS electricity (
  id SERIAL PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

-- Seed initial row
INSERT INTO electricity (value) VALUES (0)
ON CONFLICT DO NOTHING;
