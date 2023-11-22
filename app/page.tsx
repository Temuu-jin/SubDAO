import './globals.css';
import { cookies } from 'next/headers';
import React from 'react';
import { checkLogin, getUser } from '../util/auth';
import MainPage from './components/MainPageFeed';
import { PublicPostsFeed } from './components/PublicPostsFeed';

export default async function Home() {
  const token = await cookies().get('sessionToken')?.value;
  const loggedIn = token ? await checkLogin(token) : false;
  if (loggedIn) {
    const userToken = await getUser();

    return <MainPage loggedUser={userToken} />;
  }
  return <PublicPostsFeed />;
}
