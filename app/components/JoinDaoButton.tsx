'use client';
import { gql, useMutation } from '@apollo/client';
import { redirect } from 'next/navigation';
import { unstable_useCacheRefresh, useState } from 'react';

const joinDaoMutation = gql`
  mutation JoinDao($userId: ID!, $daoId: ID!) {
    joinDao(userId: $userId, daoId: $daoId) {
      username
      daos
    }
  }
`;

export default function JoinDaoButton({
  userId,
  daoId,
}: {
  userId: string;
  daoId: string;
}) {
  const refresh = unstable_useCacheRefresh();

  console.log('userId', userId);
  console.log('daoId', daoId);
  const [onError, setOnError] = useState('');
  const [joinDao] = useMutation(joinDaoMutation, {
    variables: {
      userId: userId,
      daoId: daoId,
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
      <button>Join DAO</button>
    </form>
  );
}
