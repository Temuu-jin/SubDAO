import { cache } from 'react';
import { Post } from '../util/types';
import { sql } from './connect';

export const getPosts = cache(async () => {
  const posts = await sql<Post[]>`SELECT * FROM posts`;
  return posts as Post[];
});

export const getPostById = async (id: number) => {
  const [post] = await sql<Post[]>`SELECT * FROM posts WHERE id = ${id}`;
  return post;
};

export const getPostsByUserId = async (userId: number) => {
  const posts = await sql<
    Post[]
  >`SELECT * FROM posts WHERE user_id = ${userId}`;
  return posts;
};

export const getPostsByDaoId = cache(async (daoId: number) => {
  const posts = await sql<Post[]>`SELECT * FROM posts WHERE dao_id = ${daoId}`;
  return posts;
});

export const getPrivatePostsByDaoId = cache(async (daoId: number) => {
  const posts = await sql<
    Post[]
  >`SELECT * FROM posts WHERE dao_id = ${daoId} AND members_only = true`;
  return posts;
});

export const createPost = cache(
  async (title: string, body: string, userId: number, membersOnly: boolean) => {
    const [newPost] = await sql<Post[]>`
    INSERT INTO posts (title, body, user_id, members_only)
    VALUES (${title}, ${body}, ${userId}, ${membersOnly})
    RETURNING *`;
    return newPost;
  },
);

export const createPostInDao = async (
  title: string,
  body: string,
  userId: number,
  daoId: number,
  membersOnly: boolean,
) => {
  const [newPost] = await sql<Post[]>`
    INSERT INTO posts (title, body, user_id, dao_id, members_only)
    VALUES (${title}, ${body}, ${userId}, ${daoId}, ${membersOnly})
    RETURNING *`;
  return newPost;
};

export const deletePost = cache(async (id: number) => {
  const [post] = await sql<Post[]>`
  DELETE FROM posts WHERE id = ${id}
  RETURNING *`;
  return post;
});

export const upvotePost = cache(async (id: number) => {
  const [post] = await sql<Post[]>`
  UPDATE posts SET upvotes = upvotes + 1 WHERE id = ${id}
  RETURNING *`;
  return post;
});
export const downvotePost = cache(async (id: number) => {
  const [post] = await sql<Post[]>`
  UPDATE posts SET downvotes = downvotes + 1 WHERE id = ${id}
  RETURNING *`;
  return post;
});

export const getPublicPosts = cache(async () => {
  const posts = await sql<Post[]>`
  SELECT * FROM posts WHERE members_only = false`;
  return posts;
});
