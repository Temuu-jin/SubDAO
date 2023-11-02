'use client';
import '../globals.css';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const createPostMutation = gql`
  mutation CreatePost($title: String!, $body: String!, $userId: String!) {
    createPost(title: $title, body: $body, userId: $userId) {
      title
      body
      userId
    }
  }
`;

export default function CreateDaoForm({ userId }: { userId: number }) {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();
  console.log('userId', userId, 'typeof userId', typeof userId);
  const [createPost] = useMutation(createPostMutation, {
    variables: {
      title,
      body,
      userId: userId.toString(),
    },
    onError: (error) => {
      console.log('onError', error);
      setOnError(error.message);
      return onError;
    },
    onCompleted: () => {
      router.push('/daos');
    },
  });

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
            Body
          </label>
          <input
            type="body"
            title="body"
            onChange={(event) => setBody(event.currentTarget.value)}
            placeholder="Body"
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
