'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Post } from '../../util/types';

const getAllPostsQuery = gql`
  query GetPosts {
    posts {
      title
      body
      userId
      daoId
      createdAt
    }
  }
`;

export function PostsFeed() {
  const { data, loading, error } = useQuery(getAllPostsQuery);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const posts: Post[] = data.posts;
  return (
    <div className="bg-white rounded shadow-lg p-4 text-left">
      {' '}
      {/* Shadow for depth */}
      <h2 className="text-xl font-bold mb-4">Posts</h2>
      <ul className="space-y-4">
        {' '}
        {/* Add space between post items */}
        {posts.map((post) => (
          <li
            key={post.id}
            className="p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <Link
              href={`/profile/${post.userId}`}
              className="text-blue-600 hover:underline"
            >
              <div className="text-lg font-semibold">{post.title}</div>{' '}
            </Link>

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