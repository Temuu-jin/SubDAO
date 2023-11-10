import './globals.css';
import React from 'react';
import { checkLogin, getUser } from '../util/auth';
import CreateSidebar from './components/CreateSidebar';
import MainPage from './components/MainPageFeed';
import { PublicPostsFeed } from './components/PublicPostsFeed';

export default async function Home() {
  const loggedIn = await checkLogin();
  if (loggedIn === true) {
    const userToken = await getUser();

    return <MainPage userId={userToken.id} />;
  }

  return <PublicPostsFeed />;
}
