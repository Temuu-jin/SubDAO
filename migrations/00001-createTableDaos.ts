import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`CREATE TABLE daos (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(100) NOT NULL,
    description text NOT NULL,
    created_by integer NOT NULL REFERENCES users(id),
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
  );`;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE daos;`;
}
