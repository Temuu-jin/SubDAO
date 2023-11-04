import jwt, { JwtPayload } from 'jsonwebtoken';
import { getPostsByUserId } from '../../database/posts';
import { getParsedCookie } from '../../util/cookies';

export default async function Profile() {
  // const data = await getUserById();
  const dataString: string = await getParsedCookie().toString();
  const user: JwtPayload | null = jwt.decode(dataString) as JwtPayload;
  const posts = await getPostsByUserId(user.id);
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto bg-white rounded shadow p-4">
        <h1>You are logged in as:</h1>
        {user === null ? (
          <div>no user</div>
        ) : (
          <div className="my-5">
            <div key={`animal-div-${user.userId}`}>
              <div>id: {user.id}</div>
              <div>username: {user.username}</div>
              <div>email: {user.email}</div>
              <div>member since: {user.createdAt.toString()}</div>
            </div>
            <div className="my-5">
              <h2>Posts:</h2>
              {posts.map((post) => (
                <div
                  key={`post-div-${post.id}`}
                  className="my-8 border border-black rounded-md p-3"
                >
                  <div>title: {post.title}</div>
                  <div>content: {post.body}</div>
                  <div>created at: {post.createdAt.toString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
