import './globals.css';
import React from 'react';
import { getPosts } from '../database/posts';
import { getUserById } from '../database/users';
import { getUser } from '../util/auth';
import { User } from '../util/types';
import CreatePostForm from './components/CreatePostForm';
import CreateSidebar from './components/CreateSidebar';
import Post from './components/Post';

export default async function Home() {
  const posts = await getPosts();
  const user = await getUser();
  if (user) {
    const userData = await getUserById(parseInt(user.id));
    return (
      <main className="bg-gray-100 min-h-screen p-4">
        <div className="w-[40%] ml-[10.5rem]">
          <CreatePostForm user={userData as User} />
        </div>
        <div className="container mx-auto mt-4">
          <div className="flex gap-4">
            <ul className="flex-1">
              {posts.map((post) => (
                <li key={post.id}>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                  <p>
                    Created by UserID: {post.userId} on{' '}
                    {post.createdAt.toString()}
                  </p>
                </li>
              ))}
            </ul>
            <div className="w-1/4">
              <CreateSidebar />
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto">
        <div className="flex gap-4">
          <div className="flex-1">
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
          <div className="w-1/4">
            <CreateSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
