import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`CREATE TABLE users(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username varchar(40) NOT NULL UNIQUE,
    password_hash varchar(100) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    bio text DEFAULT '',
    created_at timestamp DEFAULT NOW(),
    post_count integer DEFAULT 0,
    comment_count integer DEFAULT 0,
    user_subscriptions integer DEFAULT 0
  );`;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users;`;
}
