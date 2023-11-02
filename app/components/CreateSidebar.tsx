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
  console.log('daos', daos);
  return (
    <div className="bg-white rounded shadow p-4 text-center">
      <Link
        href="/createdao"
        className="  w-2/3 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
      >
        Create DAO
      </Link>
      <h2 className="text-xl font-bold mb-2 mt-5">DAOs</h2>
      <ul className="list-disc pl-5 list-none">
        {daos.map((dao) => (
          <li key={`dao-${dao.id}`}>
            <a href={`/daos/${dao.id}`}>{dao.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateSidebar;
