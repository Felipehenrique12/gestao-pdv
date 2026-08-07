import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.COCKROACH_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing COCKROACH_URL or DATABASE_URL in environment variables.');
}

export const pool = new Pool({
  connectionString,
  ssl: process.env.COCKROACH_SSL === 'false' ? false : true,
  max: 10,
});

export async function testDatabaseConnection() {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT NOW() AS now, version() AS version');
    return result.rows[0];
  } finally {
    client.release();
  }
}
