import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      posts (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        dao_id INTEGER REFERENCES daos (id) ON DELETE CASCADE DEFAULT NULL,
        image VARCHAR(255) DEFAULT '',
        members_only BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE posts;`;
}
