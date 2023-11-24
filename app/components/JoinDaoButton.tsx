'use client';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const joinDaoMutation = gql`
  mutation JoinDao($userId: ID!, $daoId: ID!) {
    addMembershipDao(userId: $userId, daoId: $daoId) {
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
  const router = useRouter();
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
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await joinDao();
      }}
    >
      <button className="bg-solanaGreen text-white px-3 py-1 rounded hover:bg-[#9A00FA]">
        Join DAO
      </button>
    </form>
  );
}
