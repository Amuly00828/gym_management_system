# Gym Membership Management System

Node.js + Express + PostgreSQL implementation of the assignment spec: tables,
basic queries, joins, aggregates, subqueries, updates/deletes, views, stored
procedures, and reports — all exposed through a web UI and a JSON API.

## One thing added beyond the spec

The original schema has no link between `Trainers` and `Members`, but two
required queries ("trainer with assigned members" and "trainer performance
report") need one. A small `TrainerAssignments` junction table was added
(`trainer_id`, `member_id`) to make those possible — see `db/01_schema.sql`.
Mention this if your sir asks why there's an extra table.

## Project structure

```
gym-management/
├── server.js              Express app entry point
├── db.js                  PostgreSQL connection pool
├── db/
│   ├── 01_schema.sql       All 6 tables
│   ├── 02_seed.sql         Sample data
│   ├── 03_views.sql        All 5 required views
│   ├── 04_procedures.sql   All 5 stored procedures/functions
│   └── setup.js            Runs the 4 files above against DATABASE_URL
├── routes/api.js          Every query as a REST endpoint, grouped by category
├── public/                 Web UI (index.html, style.css, script.js)
└── render.yaml             Render Blueprint (web service + Postgres)
```

## Run it locally first (recommended before deploying)

1. Install Node.js 18+ and have a PostgreSQL server available (local install,
   or a free one from [Neon](https://neon.tech) / [Supabase](https://supabase.com)).
2. Install dependencies:
   ```
   cd gym-management
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your database URL:
   ```
   cp .env.example .env
   ```
4. Create the schema, sample data, views, and procedures:
   ```
   npm run setup-db
   ```
5. Start the server:
   ```
   npm start
   ```
6. Open **http://localhost:3000** — click any query button in the sidebar.

## Deploy to Render

### Option A — Blueprint (one click, recommended)

1. Push this folder to a GitHub repository.
2. In the Render dashboard: **New → Blueprint**, connect the repo. Render
   reads `render.yaml` and provisions both the **web service** and the
   **free PostgreSQL database** automatically, wiring `DATABASE_URL` for you.
3. Click **Apply**. Wait for both to finish deploying.
4. Once the database is up, run the setup script once against it. Easiest way:
   in the Render dashboard open your web service's **Shell** tab and run:
   ```
   npm run setup-db
   ```
   (This uses the `DATABASE_URL` Render already injected into the service.)
5. Open the web service's URL — that's your live app.

### Option B — Manual setup

1. **New → PostgreSQL** in Render, create a free database. Copy its
   **External Database URL**.
2. **New → Web Service**, connect your repo.
   - Build command: `npm install`
   - Start command: `node server.js`
3. In the web service's **Environment** tab, add `DATABASE_URL` set to the
   value you copied.
4. Deploy. Then open the Shell tab and run `npm run setup-db` once.

### Free-tier notes

- Render's free Postgres databases expire after 30 days unless upgraded —
  fine for a class project demo, just re-run `setup-db` if you spin up a new one.
- The free web service spins down after inactivity and takes ~30–60s to wake
  on the next request — normal, not a bug.

## API reference

All endpoints are under `/api` and return `{ success, rows }` or
`{ success, message }`. Examples:

- `GET /api/basic/members`
- `GET /api/basic/plans-above?minPrice=5000`
- `GET /api/joins/trainer-members`
- `GET /api/aggregate/total-revenue`
- `GET /api/subqueries/plans-above-average`
- `PUT /api/updates/plan-price` — body `{ "plan_id": 1, "new_price": 1800 }`
- `DELETE /api/updates/expired-memberships`
- `GET /api/views/active-memberships`
- `POST /api/procedures/insert-member` — body `{ "member_name": "...", "email": "...", "phone": "...", "join_date": "2025-01-01" }`
- `GET /api/procedures/member-memberships/1`
- `GET /api/reports/trainer-performance`

The web UI at `/` calls every one of these with buttons, so you don't need
to hit the API by hand unless you want to.
