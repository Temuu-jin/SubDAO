import dotenv from 'dotenv';
import pgp from 'pg-promise';

dotenv.config(); // Load environment variables from .env

const { PGHOST, PGUSERNAME, PGPASSWORD, PGDATABASE } = process.env;

export const db = pgp()({
  connectionString: `postgres://${PGUSERNAME}:${PGPASSWORD}@${PGHOST}:5432/${PGDATABASE}`,
});
