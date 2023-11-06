import { url } from 'inspector';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Link from 'next/link';
import { getPostsByUserId } from '../../database/posts';
import { getParsedCookie } from '../../util/cookies';
import { ProfilePosts } from '../components/ProfilePosts';

export default async function Profile() {
  // const data = await getUserById();
  const dataString: string = await getParsedCookie().toString();
  const user: JwtPayload | null = jwt.decode(dataString) as JwtPayload;
  const posts = await getPostsByUserId(user.id);
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6">
          {user === null ? (
            <div>No user</div>
          ) : (
            <div className="flex my-4">
              <div className="w-44 h-32 mr-10 ml-2 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src="https://cdn.vectorstock.com/i/preview-1x/15/40/blank-profile-picture-image-holder-with-a-crown-vector-42411540.jpg"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold mb-4">
                  Welcome {user.username}!
                </h1>
                <div className="border-b pb-4 mb-4">
                  <div className="font-medium">
                    Account ID: <span className="font-normal">{user.id}</span>
                  </div>
                  <div className="font-medium">
                    Username:{' '}
                    <span className="font-normal">{user.username}</span>
                  </div>
                  <div className="font-medium">
                    Email: <span className="font-normal">{user.email}</span>
                  </div>
                  <div className="font-medium">
                    Member since:{' '}
                    <span className="font-normal">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <h2 className="text-xl font-semibold mb-3">Posts:</h2>
          <ProfilePosts userId={user.id} />
        </div>
      </div>
    </main>
  );
}
