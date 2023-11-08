'use client';
import '../globals.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dao, Membership, User } from '../../util/types';

const createPostMutation = gql`
  mutation CreatePost(
    $title: String!
    $body: String!
    $userId: ID!
    $daoId: ID
    $membersOnly: Boolean!
  ) {
    createPost(
      title: $title
      body: $body
      userId: $userId
      daoId: $daoId
      membersOnly: $membersOnly
    ) {
      title
      body
      userId
      membersOnly
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
  const router = useRouter();
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [membersOnly, setMembersOnly] = useState(false);
  const [onError, setOnError] = useState('');
  const [daoId, setDaoId] = useState(0);
  const [postCreated, setPostCreated] = useState(false);

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
      membersOnly,
    },
    onError: (error) => {
      setOnError(error.message);
      return onError;
    },
    onCompleted: () => {
      console.log('Posted!');
      setPostCreated(true);
    },
  });

  useEffect(() => {
    if (postCreated) {
      console.log('Before resetting form fields');

      setTitle('');
      setBody('');
      setDaoId(0);
      setMembersOnly(false);

      console.log('After resetting form fields');
      setPostCreated(false);
    }
  }, [postCreated]);
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
              title="title"
              value={title}
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
              value={body}
              onChange={(event) => setBody(event.currentTarget.value)}
              placeholder="Content..."
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded-full"
                checked={membersOnly}
                onChange={(event) =>
                  setMembersOnly(event.currentTarget.checked)
                }
              />
              <span className="text-gray-700 font-medium">Members Only</span>
            </label>

            <button className="bg-blue-600 text-white rounded-full px-8 py-2 hover:bg-blue-700 transition-colors duration-200">
              Post
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
            <option value={0}>Post on Profile</option>
            {membershipsWithNames.map((membership: MembershipWithDaoName) => (
              <option
                key={`membershipDaoID - ${membership.daoId}`}
                value={membership.daoId?.toString()}
              >
                {membership.daoName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            title="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What's happening?"
            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-full text-gray-700 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <textarea
            title="body"
            value={body}
            onChange={(event) => setBody(event.currentTarget.value)}
            placeholder="Content..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-gray-700 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              defaultChecked={membersOnly}
              className="form-checkbox h-5 w-5 text-blue-600 rounded-full"
              onChange={(event) => setMembersOnly(event.currentTarget.checked)}
            />
            <span className="text-gray-700 font-medium">Members Only</span>
          </label>

          <button className="bg-blue-600 text-white rounded-full px-8 py-2 hover:bg-blue-700 transition-colors duration-200">
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
