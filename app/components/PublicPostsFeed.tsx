'use client';

import { gql, useQuery } from '@apollo/client';
import { GetUserResponse } from '../../util/auth';
import { PostWithCommentsAndVotes } from '../../util/types';
import PostInFeed from './PostInFeed';

const getPublicPostsWithCommentsAndVotesQuery = gql`
  query PublicPostsWithCommentsAndVotes {
    publicPostsWithCommentsAndVotes {
      id
      title
      body
      userId
      daoId
      membersOnly
      createdAt
      updatedAt
      user {
        username
      }
      comments {
        body
        createdAt
        updatedAt
        user {
          username
        }
      }
      dao {
        name
      }
    }
  }
`;

type PublicPostsFeedProps = {
  loggedUser?: GetUserResponse;
};

export function PublicPostsFeed({ loggedUser }: PublicPostsFeedProps) {
  const {
    data: dataPosts,
    loading: loadingPosts,
    error: errorPosts,
  } = useQuery(getPublicPostsWithCommentsAndVotesQuery, { pollInterval: 500 });

  if (loadingPosts) return <div>Loading...</div>;
  if (errorPosts) return <div>Error: {errorPosts.message}</div>;
  console.log('dataPosts', dataPosts);

  const posts: PostWithCommentsAndVotes[] = [
    ...dataPosts.publicPostsWithCommentsAndVotes,
  ].reverse();
  console.log('posts', posts);
  return (
    <div className="text-left">
      <ul>
        {posts.map((post) => (
          <div key={post.id}>
            <PostInFeed post={post} loggedUser={loggedUser} />
          </div>
        ))}
      </ul>
    </div>
  );
}
