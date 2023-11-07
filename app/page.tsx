import './globals.css';
import Router from 'next/router';
import React from 'react';
import { getUserById } from '../database/users';
import { checkLogin, getUser } from '../util/auth';
import { User } from '../util/types';
import CreateSidebar from './components/CreateSidebar';
import MainPage from './components/MainPageFeed';
import { PublicPostsFeed } from './components/PublicPostsFeed';

export default async function Home() {
  const loggedIn = await checkLogin();
  if (loggedIn === true) {
    const userToken = await getUser();

    return <MainPage userId={userToken.id} />;
  }

  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto">
        <div className="flex gap-4">
          <div className="flex-1">
            <PublicPostsFeed />
          </div>
          <div className="w-1/4">
            <CreateSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
