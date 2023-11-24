import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  getPostsByUserId,
  getPostWithCommentsAndVotesByUser,
} from '../../../database/posts';
import { getUserById } from '../../../database/users';
import { GetUserResponse } from '../../../util/auth';
import { getParsedCookie } from '../../../util/cookies';
import { Post, PostWithCommentsAndVotes } from '../../../util/types';
import PostInFeed from '../../components/PostInFeed';
import { ProfilePosts } from '../../components/ProfilePosts';

type SinglePostPageProps = {
  params: {
    userId: string;
  };
};

export default async function Profile(props: SinglePostPageProps) {
  // const data = await getUserById();
  const dataString: string = await getParsedCookie().toString();
  const loggedUser = jwt.decode(dataString) as GetUserResponse;
  const user = await getUserById(parseInt(props.params.userId));
  const posts = await getPostWithCommentsAndVotesByUser(
    parseInt(props.params.userId),
  );
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6">
          {user === undefined ? (
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
                <h1 className="text-2xl font-semibold mb-4">{user.username}</h1>
                <div className="border-b pb-4 mb-4">
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
          {posts ? (
            <ul>
              {posts.map((post) => {
                return (
                  <div key={`post-${post.id}`}>
                    <PostInFeed post={post} loggedUser={loggedUser} />
                  </div>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </main>
  );
}
