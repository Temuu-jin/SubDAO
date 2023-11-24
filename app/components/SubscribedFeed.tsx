'use client';

import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { GetUserResponse } from '../../util/auth';
import { Membership, Post, User } from '../../util/types';

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
      membersOnly
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

export function SubscribedFeed({ user }: { user: GetUserResponse }) {
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
  const allPrivatePosts: Post[] = allPosts.filter(
    (post) => post.membersOnly === true,
  );

  const membersPrivatePosts: Post[] = allPrivatePosts.filter((post) => {
    const membership = memberships.find((m) => {
      return m.daoId === post.daoId;
    });
    return membership ? true : false;
  });
  const posts: Post[] = membersPrivatePosts;
  return (
    <div className="  text-left">
      <ul className="divide-y divide-gray-200 border border-[#d9d9d9]">
        {posts.map((post) => (
          <li
            key={`post-${post.id}`}
            className="p-4 hover:bg-gray-100 rounded-lg transition-colors duration-200 "
          >
            {/* Post Content */}
            <div className="flex">
              {/* Voting Arrows */}
              <div className="flex flex-col justify-center items-center mr-4 text-gray-400">
                <button aria-label="upvote">
                  <svg
                    className="h-6 w-6 text-gray-500 hover:text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <span className="text-xs text-gray-500">Vote</span>
                <button aria-label="downvote">
                  <svg
                    className="h-6 w-6 text-gray-500 hover:text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-shrink-0 mr-4">
                <Image
                  src="https://i.redd.it/75dkc76f6xyb1.jpg"
                  className="h-20 w-20 pt-5"
                  width={200}
                  height={200}
                  alt="Post avatar"
                />
              </div>
              <div className="flex-grow">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase hover:underline">
                    d/{post.daoId}
                  </span>
                  <span className="text-xs text-gray-400"> • </span>
                  <span className="text-xs font-semibold text-gray-500 hover:underline">
                    u/{post.userId}
                  </span>
                </div>
                <a
                  href={`/posts/${post.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {post.title}
                </a>
                <p className="text-sm text-gray-500 mt-1">{post.body}</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
              <span> Comments</span>
              <div className="flex space-x-4">
                <button>Share</button>
                <button>Save</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
