import { cache } from 'react';
import { Post, PostWithCommentsAndVotes } from '../util/types';
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

export const getAllPostsWithCommentsAndVotes = async () => {
  const result = await sql<PostWithCommentsAndVotes[]>`
    SELECT
      posts.*,
      json_build_object(
        'username', post_users.username
      ) AS user,
      json_build_object(
        'name', post_daos.name
      ) AS dao,
      COALESCE(json_agg(
        json_build_object(
          'id', comments.id,
          'body', comments.body,
          'user', json_build_object(
            'username', comment_users.username
          )
        )
      ) FILTER (WHERE comments.id IS NOT NULL), '[]') AS comments,
      COALESCE(json_agg(
        json_build_object(
          'id', votes.id,
          'vote_type', votes.vote_type
        )
      ) FILTER (WHERE votes.id IS NOT NULL), '[]') AS votes
    FROM
      posts
    LEFT JOIN
      users AS post_users ON posts.user_id = post_users.id
    LEFT JOIN
      daos AS post_daos ON posts.dao_id = post_daos.id
    LEFT JOIN
      comments ON comments.post_id = posts.id
    LEFT JOIN
      users AS comment_users ON comments.user_id = comment_users.id
    LEFT JOIN
      votes ON votes.post_id = posts.id

    GROUP BY
    posts.id, post_users.id, post_daos.id, post_daos.name
    ORDER BY
      posts.id ASC
  `;

  const posts = result.map((post) => ({
    ...post,
    user: post.user ? { username: post.user.username } : null,
    dao: post.dao ? { name: post.dao.name } : null,
    comments: post.comments || [],
    votes: post.votes || [],
  }));

  return posts;
};

export const getPublicPostsWithCommentsAndVotes = async () => {
  const result = await sql<PostWithCommentsAndVotes[]>`
    SELECT
      posts.*,
      json_build_object(
        'username', post_users.username
      ) AS user,
      json_build_object(
        'name', post_daos.name
      ) AS dao,
      COALESCE(json_agg(
        json_build_object(
          'id', comments.id,
          'body', comments.body,
          'createdAt', comments.created_at,
          'updatedAt', comments.updated_at,
          'user', json_build_object(
            'username', comment_users.username
          )
        )
      ) FILTER (WHERE comments.id IS NOT NULL), '[]') AS comments,
      COALESCE(json_agg(
        json_build_object(
          'id', votes.id,
          'vote_type', votes.vote_type
        )
      ) FILTER (WHERE votes.id IS NOT NULL), '[]') AS votes
    FROM
      posts
    LEFT JOIN
      users AS post_users ON posts.user_id = post_users.id
    LEFT JOIN
      daos AS post_daos ON posts.dao_id = post_daos.id
    LEFT JOIN
      comments ON comments.post_id = posts.id
    LEFT JOIN
      users AS comment_users ON comments.user_id = comment_users.id
    LEFT JOIN
      votes ON votes.post_id = posts.id
    WHERE
      posts.members_only = false
    GROUP BY
    posts.id, post_users.id, post_daos.id, post_daos.name
    ORDER BY
      posts.id ASC
  `;

  const posts = result.map((post) => ({
    ...post,
    user: post.user ? { username: post.user.username } : null,
    dao: post.dao ? { name: post.dao.name } : null,
    comments: post.comments || [],
    votes: post.votes || [],
  }));

  return posts;
};

export const getAllSubscribedPostsWithCommentsAndVotes = async () => {
  const result = await sql<PostWithCommentsAndVotes[]>`
    SELECT
      posts.*,
      json_build_object(
        'username', post_users.username
      ) AS user,
      json_build_object(
        'name', post_daos.name
      ) AS dao,
      COALESCE(json_agg(
        json_build_object(
          'id', comments.id,
          'body', comments.body,
          'user', json_build_object(
            'username', comment_users.username
          )
        )
      ) FILTER (WHERE comments.id IS NOT NULL), '[]') AS comments,
      COALESCE(json_agg(
        json_build_object(
          'id', votes.id,
          'vote_type', votes.vote_type
        )
      ) FILTER (WHERE votes.id IS NOT NULL), '[]') AS votes
    FROM
      posts
    LEFT JOIN
      users AS post_users ON posts.user_id = post_users.id
    LEFT JOIN
      daos AS post_daos ON posts.dao_id = post_daos.id
    LEFT JOIN
      comments ON comments.post_id = posts.id
    LEFT JOIN
      users AS comment_users ON comments.user_id = comment_users.id
    LEFT JOIN
      votes ON votes.post_id = posts.id
    WHERE
      posts.members_only = true
    GROUP BY
    posts.id, post_users.id, post_daos.id, post_daos.name
    ORDER BY
      posts.id ASC
  `;

  const posts = result.map((post) => ({
    ...post,
    user: post.user ? { username: post.user.username } : null,
    dao: post.dao ? { name: post.dao.name } : null,
    comments: post.comments || [],
    votes: post.votes || [],
  }));

  return posts;
};
