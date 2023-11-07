'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Membership, Post, User, Vote } from '../../util/types';

// Feed of Posts that are Members Only and you are a Member of

const getAllPostsQuery = gql`
  query GetPosts {
    posts {
      id
      title
      body
      userId
      daoId
      createdAt
    }
  }
`;

const getMembershipsQuery = gql`
  query GetUserMemberships($userId: ID!) {
    getUserMemberships(userId: $userId) {
      userId
      daoId
      role
      joinedAt
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

export function SubscribedFeed({ user }: { user: User }) {
  const {
    data: dataPosts,
    loading: loadingPosts,
    error: errorPosts,
  } = useQuery(getAllPostsQuery, { pollInterval: 500 });

  const {
    data: dataMemberships,
    loading: loadingMemberships,
    error: errorMemberships,
  } = useQuery(getMembershipsQuery, {
    variables: { userId: user.id },
    pollInterval: 500,
  });

  const {
    data: dataVotes,
    loading: loadingVotes,
    error: errorVotes,
  } = useQuery(getAllVotesQuery, { pollInterval: 500 });

  if (loadingPosts) return <div>Loading...</div>;
  if (errorPosts) return <div>Error: {errorPosts.message}</div>;

  if (loadingMemberships) return <div>Loading...</div>;
  if (errorMemberships) return <div>Error: {errorMemberships.message}</div>;

  if (loadingVotes) return <div>Loading...</div>;
  if (errorVotes) return <div>Error: {errorVotes.message}</div>;

  const allPosts: Post[] = dataPosts.posts;
  const memberships: Membership[] = dataMemberships.getUserMemberships;
  console.log('memberships in subscribedfeed:', memberships);

  const memberPosts: (Post | undefined)[] = allPosts.map((post) => {
    const isMember = memberships.find((membership) => {
      return membership.daoId === post.daoId;
    });
    if (isMember) {
      return post;
    }
  });
  const posts: Post[] = memberPosts
    ? memberPosts.filter((post): post is Post => post !== undefined)
    : [];
  return (
    <div className="bg-white rounded shadow-lg p-4 text-left">
      <h2 className="text-xl font-bold mb-4">Posts</h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={`post-${post.id}`}
            className="p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <Link
              href={`/profile/${post.userId}`}
              className="text-blue-600 hover:underline"
            >
              <div className="text-lg font-semibold">{post.title}</div>{' '}
            </Link>
            {}
            <div className="text-gray-700 mt-1">{post.body}</div>
            <div className="flex flex-row justify-between mt-2">
              <div className="text-xs">Created by UserID: {post.userId}</div>
              {post.daoId ? (
                <div className="text-xs">DaoID: {post.daoId}</div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
