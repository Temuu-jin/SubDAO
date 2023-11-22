'use client';
import { gql, useMutation, useQuery } from '@apollo/client';
import { unstable_useCacheRefresh, useState } from 'react';
import { Membership } from '../../util/types';

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

const leaveDaoMutation = gql`
  mutation LeaveDao($userId: ID!, $daoId: ID!) {
    leaveDao(userId: $userId, daoId: $daoId)
  }
`;

const getDaoMembersQuery = gql`
  query GetDaoMembers($daoId: ID!) {
    getDaoMembers(daoId: $daoId) {
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
  const [onError, setOnError] = useState('');

  const { data, loading, error } = useQuery(getDaoMembersQuery, {
    variables: { daoId },
  });

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
    },
    refetchQueries: [getDaoMembersQuery],
  });
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
    },
    refetchQueries: [getDaoMembersQuery],
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const membersOfDao = data.getDaoMembers as Membership[];

  const isMember = membersOfDao.some((member) => member.userId === userId);

  if (isMember) {
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
  } else {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await leaveDao();
        }}
      >
        <button className="text-blue-600 hover:text-blue-800">Leave DAO</button>
      </form>
    );
  }
}
