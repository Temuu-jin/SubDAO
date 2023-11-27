'use client';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import React from 'react';
import { Dao } from '../../util/types';

const getDaosQuery = gql`
  query GetDaos {
    daos {
      id
      name
      description
      createdBy
    }
  }
`;

export function CreateSidebar() {
  const { data, loading, error } = useQuery(getDaosQuery);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const daos = data.daos as [Dao];
  return (
    <div className="bg-white  p-6 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4 w-full text-left">DAOs</h2>
      <Link
        href="/createdao"
        className="mt-1 text-white bg-blue-600  text-sm py-2 px-4 w-full text-center transition duration-300 ease-in-out border rounded-full p-4 hover:border-solanaPurple"
      >
        Create DAO
      </Link>
      <ul className="list-none w-full">
        {daos.map((dao) => (
          <li key={`dao-${dao.id}`} className="mb-2 my-4">
            <Link
              href={`/daos/${dao.id}`}
              className="text-blue-600 hover:underline"
            >
              {dao.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateSidebar;
