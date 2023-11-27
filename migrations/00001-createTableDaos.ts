import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`CREATE TABLE daos (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(100) NOT NULL UNIQUE,
    description text NOT NULL,
    member_count integer DEFAULT 0,
    image varchar(255) DEFAULT '',
    created_by integer REFERENCES users(id),
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
  );`;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE daos;`;
}
