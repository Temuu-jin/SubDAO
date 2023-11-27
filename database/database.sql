CREATE TABLE
  users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR() NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
    /* bio text NOT NULL,
    post_count integer NOT NULL DEFAULT 0,
    comment_count integer NOT NULL DEFAULT 0,
    daos integer[] NOT NULL DEFAULT '{}' */
  );

CREATE TABLE
  posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    user_id INTEGER REFERENCES users (id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

CREATE TABLE
  COMMENTS (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    body TEXT NOT NULL,
    user_id INTEGER REFERENCES users (id),
    post_id INTEGER REFERENCES posts (id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

CREATE TABLE
  daos (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    NAME VARCHAR NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

SQL Commands:/ /
ADD col TO TABLE
ALTER TABLE users
ADD COLUMN password_hash VARCHAR NOT NULL;

/ / DELETE col
FROM
  TABLE
ALTER TABLE users
DROP COLUMN password_hash;

/ / DELETE a USER
AND associated DATA
DELETE FROM users
WHERE
  email = 'example@example.com';

/ / DELETE posts
AND COMMENTS associated
WITH
  the USER
DELETE FROM posts
WHERE
  user_id = (
    SELECT
      id
    FROM
      users
    WHERE
      email = 'user@example.com'
  );

DELETE FROM COMMENTS
WHERE
  user_id = (
    SELECT
      id
    FROM
      users
    WHERE
      email = 'user@example.com'
  );

/ / CREATE sample USER
INSERT INTO
  users (
    username,
    email,
    password_hash,
    created_at
  )
VALUES
  (
    'example',
    'example@example.com',
    'example',
    NOW()
  );
