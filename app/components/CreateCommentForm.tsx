'use client';
import '../globals.css';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const createCommentMutation = gql`
  mutation CreateComment($body: String!, $postId: ID!, $userId: ID!) {
    createComment(body: $body, postId: $postId, userId: $userId) {
      id
      userId
      postId
      body
      createdAt
    }
  }
`;

export default function CreateCommentForm({
  userId,
  postId,
  commentId,
}: {
  userId: number;
  postId: number;
  commentId: number | null;
}) {
  const [body, setBody] = useState('');
  const [onError, setOnError] = useState('');

  // Mutation
  const [createComment] = useMutation(createCommentMutation, {
    variables: {
      body,
      userId,
      postId,
      commentId: commentId ? commentId : null,
    },
    onError: (error) => {
      console.log('onError', error);
      setOnError(error.message);
      return onError;
    },
    onCompleted: () => {
      console.log('onCompleted');
    },
  });

  return (
    <div className="bg-white rounded shadow p-4 max-w-lg">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createComment();
        }}
      >
        <div className="mb-4">
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
            Comment
          </button>
        </div>
      </form>
    </div>
  );
}
