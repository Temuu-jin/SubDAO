import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(40) NOT NULL UNIQUE,
        password_hash VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        image VARCHAR(255) DEFAULT 'subdao/profilePicTemplate',
        bio TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        post_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        user_subscriptions INTEGER DEFAULT 0
      );
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users;`;
}
