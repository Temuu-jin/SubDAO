'use client';

import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { GetUserResponse } from '../../util/auth';
import {
  Membership,
  Post,
  PostWithCommentsAndVotes,
  User,
} from '../../util/types';
import PostInFeed from './PostInFeed';

// Feed of Posts that are Members Only and you are a Member of

const getAllPostsQuery = gql`
  query PostsWithCommentsAndVotes {
    postsWithCommentsAndVotes {
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
        id
        user {
          username
        }
        body
      }
      votes {
        voteType
      }
      dao {
        id
        name
      }
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

  const allPosts: PostWithCommentsAndVotes[] =
    dataPosts.postsWithCommentsAndVotes;
  const memberships: Membership[] = dataMemberships.getUserMemberships;
  const allPrivatePosts: PostWithCommentsAndVotes[] = allPosts.filter(
    (post) => post.membersOnly === true,
  );

  const membersPrivatePosts: PostWithCommentsAndVotes[] =
    allPrivatePosts.filter((post) => {
      const membership = memberships.find((m) => {
        return m.daoId === post.daoId;
      });
      return membership ? true : false;
    });
  const posts: PostWithCommentsAndVotes[] = membersPrivatePosts;
  return (
    <div className="  text-left">
      <ul className=" border-[#d9d9d9]">
        {posts.map((post) => (
          <PostInFeed key={`post-${post.id}`} post={post} loggedUser={user} />
        ))}
      </ul>
    </div>
  );
}
