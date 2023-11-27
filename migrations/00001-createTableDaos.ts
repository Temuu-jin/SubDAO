import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      daos (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        NAME VARCHAR(100) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        member_count INTEGER DEFAULT 0,
        image VARCHAR(255) DEFAULT '',
        created_by INTEGER REFERENCES users (id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE daos;`;
}
