// memberships migration
import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
  CREATE TABLE memberships (
    user_id INTEGER NOT NULL REFERENCES users(id),
    dao_id INTEGER REFERENCES daos(id) DEFAULT NULL,
    sub_to_user_id INTEGER REFERENCES users(id) DEFAULT NULL,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, dao_id)
  );
`;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE memberships;`;
}
