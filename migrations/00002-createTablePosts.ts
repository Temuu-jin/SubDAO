import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`CREATE TABLE posts(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    body text NOT NULL,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dao_id integer REFERENCES daos(id) ON DELETE CASCADE DEFAULT NULL,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
  );`;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE posts;`;
}
