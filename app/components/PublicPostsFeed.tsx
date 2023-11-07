'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Post, Vote } from '../../util/types';

const getPublicPostsQuery = gql`
  query GetPublicPosts {
    getPublicPosts {
      id
      title
      body
      userId
      daoId
      createdAt
    }
  }
`;

const getAllVotesQuery = gql`
  query GetVotes {
    votes {
      id
      userId
      postId
      commentId
      voteType
    }
  }
`;

export function PublicPostsFeed() {
  const {
    data: dataPosts,
    loading: loadingPosts,
    error: errorPosts,
  } = useQuery(getPublicPostsQuery, { pollInterval: 500 });

  const {
    data: dataVotes,
    loading: loadingVotes,
    error: errorVotes,
  } = useQuery(getAllVotesQuery, { pollInterval: 500 });

  if (loadingPosts) return <div>Loading...</div>;
  if (errorPosts) return <div>Error: {errorPosts.message}</div>;

  if (loadingVotes) return <div>Loading...</div>;
  if (errorVotes) return <div>Error: {errorVotes.message}</div>;

  const posts: Post[] = dataPosts.getPublicPosts;
  console.log('posts in postfeed:', posts);
  const votes: Vote[] = dataVotes.votes;
  console.log('votes in postfeed:', votes);
  return (
    <div className="bg-white rounded shadow-lg p-4 text-left">
      <h2 className="text-xl font-bold mb-4">Posts</h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={`post-${post.id}`}
            className="p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <Link
                  href={`/profile/${post.userId}`}
                  className="text-blue-600 hover:underline"
                >
                  <div className="text-lg font-semibold">{post.title}</div>
                </Link>
                <div className="text-gray-700 mt-1">{post.body}</div>
                <div className="text-xs text-gray-500 mt-2">
                  Created by UserID: {post.userId}
                  {post.daoId && <span> • DaoID: {post.daoId}</span>}
                  {post.membersOnly && <span> • Members Only</span>}
                </div>
              </div>
              {/* Voting Arrows - Placeholder */}
              <div className="flex flex-col justify-center items-center mr-2">
                <button className="p-2">
                  <span role="img" aria-label="upvote">
                    🔼
                  </span>
                </button>
                <span className="text-xs text-gray-500">Vote</span>
                <button className="p-2">
                  <span role="img" aria-label="downvote">
                    🔽
                  </span>
                </button>
              </div>
            </div>
            {/* Action Buttons - Placeholder */}
            <div className="flex justify-between items-center mt-4">
              <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
                2 Comments
              </button>
              <div className="flex space-x-4">
                <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
                  Share
                </button>
                <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
                  Save
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
