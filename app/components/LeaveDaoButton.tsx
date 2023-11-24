'use client';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { unstable_useCacheRefresh, use, useState } from 'react';

const removeMembershipMutation = gql`
  mutation RemoveMembership($userId: ID!, $daoId: ID!) {
    removeMembership(userId: $userId, daoId: $daoId)
  }
`;

export default function LeaveDaoButton({
  userId,
  daoId,
}: {
  userId: number;
  daoId: number;
}) {
  const router = useRouter();

  const [onError, setOnError] = useState('');
  const [leaveDao] = useMutation(removeMembershipMutation, {
    variables: {
      userId: userId,
      daoId: daoId,
    },
    onError: (error) => {
      console.log('onError', error.message);
      setOnError(error.message);
      return onError;
    },
    onCompleted: async () => {
      router.push('/daos');
      await router.refresh();
    },
  });
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await leaveDao();
      }}
    >
      <button className="bg-[#FF0000]  px-3 py-1 rounded hover:bg-[#9A00FA]">
        Leave DAO
      </button>
    </form>
  );
}
