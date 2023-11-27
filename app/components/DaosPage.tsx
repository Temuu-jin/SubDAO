'use client';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
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

export default function DaosPage() {
  const { data, loading, error } = useQuery(getDaosQuery, {
    pollInterval: 500,
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const daos = data.daos as [Dao];
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">All DAOs</h1>
        <ul>
          {daos.map((dao) => (
            <div key={`dao-${dao.id}`}>
              <Link href={`/daos/${dao.id}`}>
                <li className="mb-4 p-4 border-b">
                  <h2 className="text-xl font-semibold">{dao.name}</h2>
                  <p className="mt-2">{dao.description}</p>
                  <p>Created by UserID: {dao.createdBy}</p>
                </li>{' '}
              </Link>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
