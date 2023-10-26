import { gql } from '@apollo/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Image from 'next/image';
import Link from 'next/link';
import { getClient } from '../../util/apolloClient';
import { getParsedCookie } from '../../util/cookies';

export type UserResponse = {
  users: {
    id: number;
    username: string;
    email: string;
  }[];
};

/* async function getUserById(id: number) {
  const { data } = await getClient().query<UserResponse>({
    query: gql`
      query Users {
        users {
          id
          username
          email
        }
      }
    `,
  });
  console.log('data page.tsx:', data);
  return data;
}
 */
export default async function Profile() {
  // const data = await getUserById();
  const dataString: string = await getParsedCookie().toString();
  const user: JwtPayload | null = jwt.decode(dataString) as JwtPayload;
  console.log('data page.tsx:', user);
  return (
    <div className="flex flex-col items-center my-40">
      <h1>You are logged in as:</h1>
      {user === null ? (
        <div>no user</div>
      ) : (
        <div className="my-5">
          <div key={`animal-div-${user.userId}`}>
            <div>username: {user.username}</div>
            <div>email: {user.email}</div>
            <div>member since: {user.createdAt}</div>
          </div>
        </div>
      )}
    </div>
  );
}
