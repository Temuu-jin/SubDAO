'use client';

import { is } from 'date-fns/locale';
import { CldImage } from 'next-cloudinary';
import { useState } from 'react';
import { GetUserResponse } from '../../util/auth';
import { PostWithCommentsAndVotes, User } from '../../util/types';
import EditUser from './EditUser';
import PostInFeed from './PostInFeed';

export default function ProfilePage({
  user,
  posts,
  loggedUser,
  ownProfile,
}: {
  user?: User;
  posts?: PostWithCommentsAndVotes[];
  loggedUser?: GetUserResponse;
  ownProfile: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (ownProfile) {
    return (
      <main className="bg-gray-100 min-h-screen p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow p-6">
            {user === undefined ? (
              <div>No user</div>
            ) : (
              <div>
                {' '}
                {isEditing === false ? (
                  <div>
                    {' '}
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <div className="flex my-4">
                      <div className="w-44 h-32 mr-10 ml-2 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden">
                        <CldImage
                          width="960"
                          height="600"
                          src={user.image}
                          sizes="100vw"
                          alt="Profile Picture"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h1 className="text-2xl font-semibold mb-4">
                          {user.username}
                        </h1>
                        <div className="border-b pb-4 mb-4">
                          <div className="font-medium">
                            Email:{' '}
                            <span className="font-normal">{user.email}</span>
                          </div>
                          <div className="font-medium">
                            Member since:{' '}
                            <span className="font-normal">
                              {new Date(user.createdAt).toLocaleDateString(
                                'en-US',
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {' '}
                    <button onClick={() => setIsEditing(false)}>Save</button>
                    <EditUser user={user} />
                  </>
                )}
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
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6">
          {user === undefined ? (
            <div>No user</div>
          ) : (
            <div className="flex my-4">
              <div className="w-44 h-32 mr-10 ml-2 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden">
                <CldImage
                  width="960"
                  height="600"
                  src={user.image}
                  sizes="100vw"
                  alt="Profile Picture"
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
