import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      COMMENTS (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        body TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        post_id INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
        comment_ref INTEGER REFERENCES COMMENTS (id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE COMMENTS;`;
}
