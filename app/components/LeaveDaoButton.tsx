'use client';
import { gql, useMutation } from '@apollo/client';
import { unstable_useCacheRefresh, useState } from 'react';

const leaveDaoMutation = gql`
  mutation LeaveDao($userId: ID!, $daoId: ID!) {
    leaveDao(userId: $userId, daoId: $daoId) {
      username
      daos
    }
  }
`;

export default function LeaveDaoButton({
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
  const [leaveDao] = useMutation(leaveDaoMutation, {
    variables: {
      userId: userId,
      daoId: daoId,
    },
    onError: (error) => {
      console.log('onError', error.message);
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
        await leaveDao();
      }}
    >
      <button>Leave DAO</button>
    </form>
  );
}
