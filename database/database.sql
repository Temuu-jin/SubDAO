CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username varchar NOT NULL UNIQUE,
  email varchar NOT NULL UNIQUE,
  created_at timestamp DEFAULT NOW()
  bio text NOT NULL,
  post_count integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  daos
);

CREATE TABLE posts(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  body text NOT NULL,
  user_id integer REFERENCES users(id),
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  body text NOT NULL,
  user_id integer REFERENCES users(id),
  post_id integer REFERENCES posts(id),
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

CREATE TABLE daos (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar NOT NULL,
  description text NOT NULL,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

SQL Commands:
  // Add col to table
  ALTER TABLE users
  ADD COLUMN username varchar NOT NULL UNIQUE;

  // Delete col from table
  ALTER TABLE users
  DROP COLUMN password_hash;

  // Delete a user and associated data
  DELETE FROM users
  WHERE email = 'user@example.com';

  // Delete posts and comments associated with the user
  DELETE FROM posts
  WHERE user_id = (SELECT id FROM users WHERE email = 'user@example.com');

  DELETE FROM comments
  WHERE user_id = (SELECT id FROM users WHERE email = 'user@example.com');

  // Create sample user
  INSERT INTO users (email, created_at)
  VALUES ('example@example.com', NOW());
