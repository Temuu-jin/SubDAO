import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      votes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users (id),
        post_id INTEGER REFERENCES posts (id) ON DELETE CASCADE,
        comment_id INTEGER REFERENCES COMMENTS (id) ON DELETE CASCADE,
        vote_type SMALLINT NOT NULL CHECK (
          vote_type IN (-1, 1)
        ),
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT chk_vote_type CHECK (
          (
            post_id IS NOT NULL
            AND comment_id IS NULL
          )
          OR (
            post_id IS NULL
            AND comment_id IS NOT NULL
          )
        )
      );
  `;

  await sql`
    CREATE UNIQUE INDEX idx_vote_post ON votes (
      user_id,
      post_id
    )
    WHERE
      post_id IS NOT NULL;
  `;

  await sql`
    CREATE UNIQUE INDEX idx_vote_comment ON votes (
      user_id,
      comment_id
    )
    WHERE
      comment_id IS NOT NULL;
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE votes;`;
}
