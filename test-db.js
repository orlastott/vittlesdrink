import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Postgres connected:', res.rows[0]);
    await pool.end();
  } catch (err) {
    console.error('Postgres connection failed:', err);
  }
}

test();
