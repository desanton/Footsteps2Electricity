# ⚡ Footsteps → Electricity

> "In Japan they are turning footsteps into electricity."

A production-ready full-stack web app that simulates generating electricity from footsteps. Click the button → database increments → electricity counter updates in real time.

**Stack:** React 18 + Express + PostgreSQL + Railway

---

## 🎨 Features

- **3-Panel Responsive Layout**: Japan map, video card, live counter
- **Real-time Updates**: Click to generate electricity, instant DB sync
- **Beautiful Dark UI**: Gradient buttons, glowing cards, smooth animations
- **Production Ready**: Deployable to Railway in minutes
- **Minimal Dependencies**: No Redux, no bloat—just React + Express + PostgreSQL

---

## 📁 Folder Structure

```
Footsteps2Electricity/
├── client/                    # React frontend (CRA)
│   ├── public/
│   │   └── index.html        # HTML entry point
│   ├── src/
│   │   ├── App.js            # Main component (3-panel layout)
│   │   ├── App.css           # Dark theme styles + animations
│   │   └── index.js          # React root
│   └── package.json
├── server/                    # Express backend
│   ├── index.js              # All routes + DB init
│   └── package.json
├── .env.example              # Template for env vars
├── .gitignore                # Git ignore rules
├── package.json              # Root (shared scripts)
├── railway.toml              # Railway deployment config
└── schema.sql                # DB schema (one-time setup)
```

---

## 🚀 Quick Start (Local Dev)

### Prerequisites
- **Node.js 18+** ([download](https://nodejs.org))
- **PostgreSQL 12+** ([download](https://www.postgresql.org/download/))

### 1. Setup Database

```bash
# Create local PostgreSQL database
createdb footsteps

# Run schema
psql footsteps < schema.sql
```

### 2. Clone & Install

```bash
cd Footsteps2Electricity
cp .env.example .env

# Edit .env with your DB URL (use your actual Neon or Railway PostgreSQL URL)
# Example: DATABASE_URL=postgresql://user:password@host:5432/dbname

npm install
```

### 3. Run Frontend & Backend Together

```bash
npm run dev
```

This starts:
- **Backend**: `http://localhost:4000` (Express server)
- **Frontend**: `http://localhost:3000` (React dev server)

The React app will proxy API calls to the backend automatically.

### 4. Test It

- Open [http://localhost:3000](http://localhost:3000)
- Click the big blue footstep button
- Watch the electricity counter increment

---

## 🌐 Deploying to Railway

### 1. Prepare GitHub

Ensure your repo is pushed to GitHub. The root of your repository should have:
```
repo/
├── client/
├── server/
├── package.json       ← Root package.json with build + start scripts
├── railway.toml
└── .env  (NOT in git, set via Railway dashboard)
```

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your **Footsteps2Electricity** repository
4. Railway will auto-detect and use the root directory ✓

### 3. Add PostgreSQL

1. In Railway dashboard, click **+ New**
2. Add **PostgreSQL** service
3. Once provisioned, copy the `DATABASE_URL` connection string

### 4. Set Environment Variables

1. In your app service settings, add:
   - `DATABASE_URL`: Paste from PostgreSQL service
   - `NODE_ENV`: `production`

2. Railway will auto-link the PostgreSQL plugin, but manually set it if needed.

### 5. Deploy

1. Railway will auto-detect your GitHub repo
2. It will use the root directory (Footsteps2Electricity/) automatically
3. Click **Deploy**

Railway will:
- Run `npm run build` (builds React, installs server deps)
- Run `npm start` (starts Express server on PORT from Railway)
- Serve React static files + handle API routes

### 6. Health Check

Once live, test the endpoint:
```bash
curl https://your-railway-domain.app/electricity
```

You should see:
```json
{ "electricity": 0 }
```

---

## 📡 API Reference

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/electricity` | Get current counter | `{ electricity: number }` |
| `POST` | `/generate` | Increment by 1 | `{ electricity: number }` |

### Example Usage

```javascript
// Get current value
fetch('/electricity')
  .then(r => r.json())
  .then(d => console.log(d.electricity)); // e.g., 42

// Increment
fetch('/generate', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log(d.electricity)); // e.g., 43
```

---

## 🛠️ Development

### Start Dev Mode
```bash
npm run dev
```
Runs both React dev server and Express with auto-reload.

### Build for Production
```bash
npm run build
```
Builds React app → `client/build/`

### Start Production Server
```bash
npm start
```
Serves React static files + API routes on port `$PORT` (Railway sets this).

---

## 🎨 Customization

### Change Electricity Increment

In [server/index.js](server/index.js), line ~35:
```javascript
'UPDATE electricity SET value = value + 1 WHERE id = 1 RETURNING value'
// Change +1 to +10, +100, etc.
```

### Change Colors

In [client/src/App.css](client/src/App.css):
```css
:root {
  --blue: #3b82f6;  /* Change to your color */
  --green: #22c55e; /* Status dot */
  /* ... */
}
```

### Change Button Text

In [client/src/App.js](client/src/App.js), search for "Click to generate electricity" and update.

---

## 🔧 Troubleshooting

### "Cannot connect to database"
- Ensure PostgreSQL is running: `brew services start postgresql`
- Check `DATABASE_URL` in `.env` matches your setup
- Run `psql footsteps < schema.sql` again

### "Port 3000/4000 in use"
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

### React build fails on Railway
- Ensure `npm run build` works locally first
- Check `client/package.json` has all dependencies
- Increase Railway memory limit if needed

### API returns 500 error
- Check Railway PostgreSQL is connected
- Verify `DATABASE_URL` env var is set
- Check Railway logs: `railway logs`

---

## 📝 License

MIT

---

## 🎬 Next Steps

1. Customize the website design
2. Add real kinetic energy data from actual floor sensors
3. Connect to real power grids or smart home systems
4. Deploy to other platforms (Vercel, Heroku, AWS, Azure)

**Made with ⚡ in Tokyo** 🇯🇵
