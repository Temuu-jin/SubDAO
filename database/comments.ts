import { cache } from 'react';
import { Comment } from '../util/types';
import { sql } from './connect';

export const getComments = cache(async () => {
  const comments = await sql<Comment[]>`SELECT * FROM comments`;
  return comments;
});

export const getCommentById = cache(async (id: number) => {
  const [comment] = await sql<
    Comment[]
  >`SELECT * FROM comments WHERE id = ${id}`;
  return comment;
});

export const getCommentsByPostId = cache(async (postId: number) => {
  const comments = await sql<
    Comment[]
  >`SELECT * FROM comments WHERE post_id = ${postId}`;
  return comments;
});

export const getCommentsByUserId = cache(async (userId: number) => {
  const comments = await sql<
    Comment[]
  >`SELECT * FROM comments WHERE user_id = ${userId}`;
  return comments;
});

export const createComment = cache(
  async (body: string, userId: number, postId: number) => {
    const [newComment] = await sql<Comment[]>`
    INSERT INTO comments (name, description)
    VALUES ( ${body}, ${userId}, ${postId})
    RETURNING *`;
    return newComment;
  },
);

export const createCommentInComment = cache(
  async (body: string, userId: number, postId: number, commentRef: number) => {
    const [newComment] = await sql<Comment[]>`
    INSERT INTO comments (name, description, comment_ref)
    VALUES ( ${body}, ${userId}, ${postId}, ${commentRef})
    RETURNING *`;
    return newComment;
  },
);

export const deleteComment = cache(async (id: number) => {
  const [comment] = await sql<Comment[]>`
  DELETE FROM comments WHERE id = ${id}
  RETURNING *`;
  return comment;
});
