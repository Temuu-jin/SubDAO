'use client';
import '../globals.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Dao, User } from '../../util/types';

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

const getDaosFromUserQuery = gql`
  query GetDaosFromUser($daos: [Int!]!) {
    daosFromUser(daos: $daos) {
      id
      name
    }
  }
`;

export default function CreatePostForm({ user }: { user: User }) {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [onError, setOnError] = useState('');
  const [daoId, setDaoId] = useState(1);
  const router = useRouter();
  // Queries
  const {
    data: daosData,
    loading: daosLoading,
    error: daosError,
  } = useQuery(getDaosFromUserQuery, {
    variables: { daos: user.daos },
  });
  // Mutation
  const [createPost] = useMutation(createPostMutation, {
    variables: {
      title,
      body,
      userId: user.id,
      daoId,
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

  if (daosLoading) return <div>Loading...</div>;
  if (daosError) return <div>Error: {daosError.message}</div>;

  // handle data
  const daos = daosData.daosFromUser as [Dao];
  console.log('daos', daos);
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
            {daos.map((dao) => {
              console.log('dao.id', dao.id);
              console.log('dao.name', dao.name);
              return (
                <option key={dao.id} value={dao.id}>
                  /{dao.name}
                </option>
              );
            })}
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
