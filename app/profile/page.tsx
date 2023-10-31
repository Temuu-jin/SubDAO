import jwt, { JwtPayload } from 'jsonwebtoken';
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
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto bg-white rounded shadow p-4">
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
    </main>
  );
}
