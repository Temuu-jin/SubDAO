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
    daos integer[] DEFAULT '{}'
  );`;
}

export async function up(sql: Sql) {
  await sql`CREATE TABLE daos (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(100) NOT NULL UNIQUE,
    description text NOT NULL,
    created_by integer REFERENCES users(id),
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
  );`;
}

export async function up(sql: Sql) {
  await sql`CREATE TABLE posts(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    body text NOT NULL,
    user_id integer NOT NULL REFERENCES users(id),
    dao_id integer REFERENCES daos(id),
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
  );`;
}

export async function up(sql: Sql) {
  await sql`CREATE TABLE comments(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    body text NOT NULL,
    user_id integer NOT NULL REFERENCES users(id),
    post_id integer NOT NULL REFERENCES posts(id),
    comment_ref integer REFERENCES comments(id),
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
  );`;
}
