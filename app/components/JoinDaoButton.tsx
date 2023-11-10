'use client';
import { gql, useMutation } from '@apollo/client';
import { unstable_useCacheRefresh, useState } from 'react';

const joinDaoMutation = gql`
  mutation JoinDao($userId: ID!, $daoId: ID!) {
    addMembership(userId: $userId, daoId: $daoId) {
      userId
      daoId
      role
      joinedAt
    }
  }
`;

export default function JoinDaoButton({
  userId,
  daoId,
}: {
  userId: number;
  daoId: number;
}) {
  const refresh = unstable_useCacheRefresh();

  console.log('userId', userId);
  console.log('daoId', daoId);
  const [onError, setOnError] = useState('');
  const [joinDao] = useMutation(joinDaoMutation, {
    variables: {
      userId,
      daoId,
    },
    onError: (error) => {
      setOnError(error.message);
      return onError;
    },
    onCompleted: () => {
      console.log('onCompleted');
      refresh();
    },
  });
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await joinDao();
      }}
    >
      <button className="bg-[#d900fa] text-white px-3 py-1 rounded hover:bg-[#9A00FA]">
        Join DAO
      </button>
    </form>
  );
}
