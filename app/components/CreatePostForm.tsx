'use client';
import '../globals.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Dao, Membership, User } from '../../util/types';

const createPostMutation = gql`
  mutation CreatePost(
    $title: String!
    $body: String!
    $userId: ID!
    $daoId: ID
  ) {
    createPost(title: $title, body: $body, userId: $userId, daoId: $daoId) {
      title
      body
      userId
    }
  }
`;

const getUserMembershipsQuery = gql`
  query GetUserMemberships($userId: ID!) {
    getUserMemberships(userId: $userId) {
      userId
      daoId
      role
      joinedAt
    }
  }
`;
const getDaosQuery = gql`
  query GetDaos {
    daos {
      id
      name
      description
      createdBy
    }
  }
`;
export type MembershipWithDaoName = Membership & {
  daoName: string;
};

export default function CreatePostForm({ user }: { user: User }) {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [onError, setOnError] = useState('');
  const [daoId, setDaoId] = useState(0);
  const router = useRouter();
  // Queries
  const {
    data: userMembershipsData,
    loading: userMembershipsLoading,
    error: userMembershipsError,
  } = useQuery(getUserMembershipsQuery, {
    variables: { userId: user.id },
  });

  const {
    data: daosData,
    loading: daosLoading,
    error: daosError,
  } = useQuery(getDaosQuery);
  // Mutation
  const [createPost] = useMutation(createPostMutation, {
    variables: {
      title,
      body,
      userId: user.id,
      ...(daoId && { daoId }),
    },
    onError: (error) => {
      console.log('title', title);
      console.log('body', body);

      console.log('onError', error);
      setOnError(error.message);
      return onError;
    },
    onCompleted: () => {
      console.log('onCompleted');
      router.push('/daos');
    },
  });

  // handle loading and error states

  if (userMembershipsLoading) return <div>Loading...</div>;
  if (userMembershipsError) {
    return <div>Error: {userMembershipsError.message}</div>;
  }

  if (daosLoading) return <div>Loading...</div>;
  if (daosError) return <div>Error: {daosError.message}</div>;

  // handle data
  console.log('userMembershipsData', userMembershipsData);
  let membershipsWithNames: MembershipWithDaoName[] = [];

  if (
    userMembershipsData &&
    userMembershipsData.getUserMemberships.length !== 0
  ) {
    membershipsWithNames = userMembershipsData.getUserMemberships.map(
      (membership: MembershipWithDaoName) => {
        const memberDao = daosData.daos.find(
          (dao: Dao) => dao.id === membership.daoId,
        );
        return {
          ...membership,
          daoName: memberDao ? memberDao.name : '',
        } as MembershipWithDaoName;
      },
    );
  }

  if (membershipsWithNames.length === 0 || !membershipsWithNames) {
    return (
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2">Create Post</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createPost();
          }}
        >
          <div className="mb-4">
            <select
              value={daoId}
              onChange={(e) => setDaoId(parseInt(e.target.value))}
            >
              <option key={'profilePost'} value={0}>
                Post on Profile
              </option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              title="title"
              onChange={(event) => setTitle(event.currentTarget.value)}
              placeholder="Title"
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              title="body"
              onChange={(event) => setBody(event.currentTarget.value)}
              placeholder="Content..."
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mt-6">
            <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
              Create Post
            </button>
          </div>
        </form>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createPost();
        }}
        className="flex flex-col space-y-2"
      >
        <div>
          <select
            value={daoId}
            onChange={(e) => setDaoId(parseInt(e.target.value))}
            className="form-select block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" // Adjusted focus ring color
          >
            <option key={'profilePost'} value={0}>
              Post on Profile
            </option>
            {membershipsWithNames.map((membership: MembershipWithDaoName) => (
              <option key={membership.daoId} value={membership.daoId}>
                {membership.daoName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="text"
            title="title"
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder="What's happening?"
            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-full text-gray-700 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <textarea
            title="body"
            onChange={(event) => setBody(event.currentTarget.value)}
            placeholder="Content..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-gray-700 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <button className="bg-blue-600 text-white rounded-full px-8 py-2 hover:bg-blue-700 transition-colors duration-200">
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
