// memberships migration
import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
  CREATE TABLE memberships (
    user_id INTEGER NOT NULL REFERENCES users(id),
    dao_id INTEGER REFERENCES daos(id),
    sub_to_user_id INTEGER REFERENCES users(id),
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, dao_id),
    CONSTRAINT chk_membership_type CHECK (
      (dao_id IS NOT NULL AND sub_to_user_id IS NULL) OR
      (dao_id IS NULL AND sub_to_user_id IS NOT NULL))
  );
`;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE memberships;`;
}
