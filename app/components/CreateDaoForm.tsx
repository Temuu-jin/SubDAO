'use client';
import '../globals.css';
import { gql, useMutation } from '@apollo/client';
import { redirect } from 'next/navigation';
import { useState } from 'react';

const createDaoMutation = gql`
  mutation CreateDao($name: String!, $description: String!, $userId: String!) {
    createDao(name: $name, description: $description, userId: $userId) {
      name
      description
      createdBy
    }
  }
`;

export default function CreateDaoForm({ userId }: { userId: number }) {
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [onError, setOnError] = useState('');
  const [createDao] = useMutation(createDaoMutation, {
    variables: {
      name,
      description,
      userId: userId.toString(),
    },
    onError: (error) => {
      console.log('onError', error);
      setOnError(error.message);
      return onError;
    },
    onCompleted: () => {
      redirect('/daos');
    },
  });

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold mb-2">Create DAO</h2>
      <p>Content goes here...</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createDao();
        }}
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="Name"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            type="description"
            name="description"
            onChange={(event) => setDescription(event.currentTarget.value)}
            placeholder="Description"
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>

        <div className="mt-6">
          <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Create Dao
          </button>
        </div>
      </form>
    </div>
  );
}
