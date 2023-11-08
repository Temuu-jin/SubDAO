'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Post } from '../../util/types';

const getProfilePostsQuery = gql`
  query PostsByUser($userId: ID!) {
    postsByUser(userId: $userId) {
      id
      title
      body
      userId
      daoId
    }
  }
`;

export function ProfilePosts({ userId }: { userId: string }) {
  const { data, loading, error } = useQuery(getProfilePostsQuery, {
    variables: { userId },
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const posts: Post[] = data.postsByUser;
  console.log('posts in publicpostsfeed: ', posts);
  return (
    <div className="bg-white rounded shadow-lg p-4 text-left">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">Posts</h2>{' '}
      {/* Add border-bottom to the title */}
      <ul className="divide-y divide-gray-200">
        {' '}
        {/* Add dividers between posts */}
        {posts.map((post) => (
          <li
            key={`post-${post.id}`}
            className="p-4 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <Link
              href={`/profile/${post.id}`}
              className="flex items-center space-x-2 text-blue-600 hover:underline"
            >
              {/* Flex container for horizontal layout and space between avatar and text */}
              <div className="flex-shrink-0">
                {' '}
                {/* Container for avatar, if you have one */}
                <img
                  className="h-10 w-10 rounded-full"
                  src="/public/images/blank-profile-picture.jpg"
                  alt=""
                />
              </div>
              <div className="flex-1 min-w-0">
                {' '}
                {/* Flex item for title and body, ensuring text wrapping */}
                <p className="text-sm font-medium text-gray-900 truncate">
                  {post.title}
                </p>{' '}
                {/* Title with truncation */}
                <p className="text-sm text-gray-500">{post.body}</p>{' '}
                {/* Body with gray text */}
              </div>
            </Link>
            <div className="mt-2 flex justify-between space-x-4">
              {' '}
              {/* Container for metadata and actions */}
              <div className="flex space-x-1 text-gray-500 text-xs">
                <span aria-hidden="true">&middot;</span> {/* Separator dot */}
                <span>{post.userId}</span> {/* UserID */}
              </div>
              {post.daoId && (
                <div className="flex items-center space-x-1">
                  <div className="text-xs font-medium text-gray-900">
                    DaoID: {post.daoId}
                  </div>{' '}
                  {/* DaoID if exists */}
                </div>
              )}
              {/* Optional icons or actions could go here */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
