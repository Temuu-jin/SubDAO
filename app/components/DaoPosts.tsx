'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Post } from '../../util/types';

const getDaoPostsQuery = gql`
  query PostsByDao($daoId: ID!) {
    postsByDao(daoId: $daoId) {
      id
      title
      body
      userId
    }
  }
`;

export function DaoPosts({ daoId }: { daoId: string }) {
  const { data, loading, error } = useQuery(getDaoPostsQuery, {
    variables: { daoId },
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const posts: Post[] = data.postsByDao;
  return (
    <div className="bg-white rounded shadow p-4 text-center">
      <h2 className="text-xl font-bold mb-2 mt-5">DAO Posts</h2>
      <ul className="list-disc pl-5 list-none">
        {posts.map((post) => (
          <div key={`post-${post.id}`}>
            <Link href={`/daos/${daoId as string}/${post.id as number}`}>
              <div>Title: {post.title}</div>
              <div>{post.body}</div>
              <div>Created by UserID: {post.userId}</div>
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
}
