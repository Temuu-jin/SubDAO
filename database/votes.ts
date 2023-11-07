import postgres from 'postgres';
import { cache } from 'react';
import { Vote } from '../util/types';
import { sql } from './connect';

export const upvotePost = cache(async (userId: number, postId: number) => {
  const [vote] = await sql<Vote[]>`
    INSERT INTO votes (user_id, post_id, vote_type)
    VALUES (${userId}, ${postId}, 1)
    ON CONFLICT (user_id, post_id)
    WHERE post_id IS NOT NULL
    DO UPDATE SET vote_type = 1
    RETURNING *`;
  return vote;
});

export const downvotePost = cache(async (userId: number, postId: number) => {
  const [vote] = await sql<Vote[]>`
    INSERT INTO votes (user_id, post_id, vote_type)
    VALUES (${userId}, ${postId}, -1)
    ON CONFLICT (user_id, post_id)
    WHERE post_id IS NOT NULL
    DO UPDATE SET vote_type = -1
    RETURNING *`;
  return vote;
});

export const upvoteComment = cache(
  async (userId: number, commentId: number) => {
    const [vote] = await sql<Vote[]>`
    INSERT INTO votes (user_id, comment_id, vote_type)
    VALUES (${userId}, ${commentId}, 1)
    ON CONFLICT (user_id, comment_id)
    WHERE comment_id IS NOT NULL
    DO UPDATE SET vote_type = 1
    RETURNING *`;
    return vote;
  },
);

export const downvoteComment = cache(
  async (userId: number, commentId: number) => {
    const [vote] = await sql<Vote[]>`
    INSERT INTO votes (user_id, comment_id, vote_type)
    VALUES (${userId}, ${commentId}, -1)
    ON CONFLICT (user_id, comment_id)
    WHERE comment_id IS NOT NULL
    DO UPDATE SET vote_type = -1
    RETURNING *`;
    return vote;
  },
);
export const undoVoteOnPost = cache(async (userId: number, postId: number) => {
  const result = await sql<postgres.Row[]>`
    DELETE FROM votes
    WHERE user_id = ${userId} AND post_id = ${postId};
  `;
  return result.count > 0;
});
export const undoVoteOnComment = cache(
  async (userId: number, commentId: number) => {
    const result = await sql<postgres.Row[]>`
    DELETE FROM votes
    WHERE user_id = ${userId} AND comment_id = ${commentId};
  `;
    return result.count > 0;
  },
);

export const getAllVotesForPost = async (postId: number): Promise<Vote[]> => {
  const votes = await sql<Vote[]>`
    SELECT * FROM votes
    WHERE post_id = ${postId};
  `;
  return votes;
};
export const getAllVotesForComment = async (
  commentId: number,
): Promise<Vote[]> => {
  const votes = await sql<Vote[]>`
    SELECT * FROM votes
    WHERE comment_id = ${commentId};
  `;
  return votes;
};
export const getVoteForPostByUser = async (
  userId: number,
  postId: number,
): Promise<Vote | null> => {
  const vote = await sql<Vote[]>`
    SELECT * FROM votes
    WHERE user_id = ${userId} AND post_id = ${postId};
  `;
  return vote[0] || null;
};
export const getVoteForCommentByUser = async (
  userId: number,
  commentId: number,
): Promise<Vote | null> => {
  const vote = await sql<Vote[]>`
    SELECT * FROM votes
    WHERE user_id = ${userId} AND comment_id = ${commentId};
  `;
  return vote[0] || null;
};

export const getVotes = async (): Promise<Vote[]> => {
  const votes = await sql<Vote[]>`
    SELECT * FROM votes;`;
  return votes;
};
