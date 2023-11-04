import { cache } from 'react';
import { Post } from '../util/types';
import { sql } from './connect';

export const getPosts = cache(async () => {
  const posts = await sql<Post[]>`SELECT * FROM posts`;
  return posts;
});

export const getPostById = cache(async (id: number) => {
  const [post] = await sql<Post[]>`SELECT * FROM posts WHERE id = ${id}`;
  return post;
});

export const getPostsByUserId = cache(async (userId: number) => {
  const posts = await sql<
    Post[]
  >`SELECT * FROM posts WHERE user_id = ${userId}`;
  return posts;
});

export const getPostsByDaoId = cache(async (daoId: number) => {
  const posts = await sql<Post[]>`SELECT * FROM posts WHERE dao_id = ${daoId}`;
  return posts;
});

export const createPost = cache(
  async (title: string, body: string, userId: number) => {
    const [newPost] = await sql<Post[]>`
    INSERT INTO posts (title, body, user_id)
    VALUES (${title}, ${body}, ${userId})
    RETURNING *`;
    return newPost;
  },
);

export const createPostInDao = cache(
  async (title: string, body: string, userId: number, daoId: number) => {
    const [newPost] = await sql<Post[]>`
    INSERT INTO posts (title, body, user_id, dao_id)
    VALUES (${title}, ${body}, ${userId}, ${daoId})
    RETURNING *`;
    return newPost;
  },
);

export const deletePost = cache(async (id: number) => {
  const [post] = await sql<Post[]>`
  DELETE FROM posts WHERE id = ${id}
  RETURNING *`;
  return post;
});
