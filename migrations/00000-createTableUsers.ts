import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`CREATE TABLE users(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username varchar(40) NOT NULL UNIQUE,
    password_hash varchar(100) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    created_at timestamp DEFAULT NOW()
    /* bio text NOT NULL,
    post_count integer NOT NULL DEFAULT 0,
    comment_count integer NOT NULL DEFAULT 0,
    daos integer[] NOT NULL DEFAULT '{}' */
  );`;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users;`;
}
