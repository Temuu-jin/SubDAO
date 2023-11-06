import './globals.css';
import React from 'react';
import { getUserById } from '../database/users';
import { getUser } from '../util/auth';
import { User } from '../util/types';
import CreatePostForm from './components/CreatePostForm';
import CreateSidebar from './components/CreateSidebar';
import { PostsFeed } from './components/PostsFeed';

export default async function Home() {
  const user = await getUser();
  if (user) {
    const userData = await getUserById(parseInt(user.id));
    return (
      <main className="bg-gray-100 min-h-screen p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex gap-8">
            <div className="flex flex-col w-3/5 space-y-6">
              <CreatePostForm user={userData as User} />
              <PostsFeed />
            </div>
            <div className="w-2/5">
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
            <PostsFeed />
          </div>
          <div className="w-1/4">
            <CreateSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
