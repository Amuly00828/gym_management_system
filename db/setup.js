// Runs schema, seed data, views, and stored procedures against DATABASE_URL.
// Usage: npm run setup-db
const fs = require('fs');
const path = require('path');
const pool = require('../db');

const files = [
  '01_schema.sql',
  '02_seed.sql',
  '03_views.sql',
  '04_procedures.sql'
];

async function run() {
  const client = await pool.connect();
  try {
    for (const file of files) {
      const filePath = path.join(__dirname, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`Running ${file} ...`);
      await client.query(sql);
      console.log(`Done: ${file}`);
    }
    console.log('Database setup complete.');
  } catch (err) {
    console.error('Setup failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
