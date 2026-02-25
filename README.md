# ⚡ Footstep Electricity Generator

> In Japan, they are turning footsteps into electricity.

A full-stack simulation of kinetic energy generation from footsteps. Click the button → database increments → electricity counter updates in real time.

## Stack

- **Frontend**: React (CRA), functional components, useState + useEffect
- **Backend**: Express + pg + dotenv + CORS
- **Database**: PostgreSQL (single row counter)
- **Deploy**: Railway

---

## Folder Structure

```
footstep-app/
├── client/              # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/              # Express backend
│   ├── index.js
│   └── package.json
├── schema.sql           # DB schema
├── package.json         # Root (build + start scripts)
├── railway.toml         # Railway config
├── .env.example
└── .gitignore
```

---

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Clone & install
```bash
git clone <your-repo>
cd footstep-app
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Set up environment
```bash
cp .env.example server/.env
# Edit server/.env with your local DATABASE_URL
```

### 3. Initialize DB
```bash
psql $DATABASE_URL -f schema.sql
# Or let the server auto-init on first boot
```

### 4. Run dev servers
```bash
# Terminal 1 - Backend (port 4000)
cd server && npm run dev

# Terminal 2 - Frontend (port 3000, proxies API to 4000)
cd client && npm start
```

---

## Deploy to Railway

### Step 1 – Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/footstep-app.git
git push -u origin main
```

### Step 2 – Create Railway project
1. Go to [railway.app](https://railway.app) → **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your `footstep-app` repository

### Step 3 – Add PostgreSQL
1. In your Railway project → **+ New** → **Database** → **PostgreSQL**
2. Railway auto-creates a `DATABASE_URL` variable

### Step 4 – Configure environment variables
In your Railway **web service** settings → **Variables**, add:
```
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}   ← Railway reference variable
```

### Step 5 – Deploy
Railway auto-deploys on push. The build process:
1. Runs `npm run build` → builds React into `client/build/`
2. Runs `npm start` → starts Express which serves the React build + API

### Step 6 – Verify
- Visit your Railway-provided URL
- `GET /electricity` should return `{"electricity": 0}`
- Click the button → `POST /generate` → counter increments

---

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/electricity` | Returns `{ electricity: number }` |
| `POST` | `/generate` | Increments by 1, returns updated `{ electricity: number }` |

---

## DB Schema

```sql
CREATE TABLE electricity (
  id SERIAL PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);
-- Single row, id=1, starts at 0
```

The server auto-creates this table and seeds the initial row on startup if it doesn't exist.
