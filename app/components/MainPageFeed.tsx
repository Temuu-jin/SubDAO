'use client';
import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { User } from '../../util/types';
import CreatePostForm from './CreatePostForm';
import CreateSidebar from './CreateSidebar';
import { PublicPostsFeed } from './PublicPostsFeed';
import { SubscribedFeed } from './SubscribedFeed';

// Import your PostsFeed components once they're created
// import BestPostsFeed from './BestPostsFeed';
// import HotPostsFeed from './HotPostsFeed';
// import NewPostsFeed from './NewPostsFeed';
// import TopPostsFeed from './TopPostsFeed';
const getUserByIdQuery = gql`
  query UserById($userById: ID!) {
    userById(id: $userById) {
      id
      username
      passwordHash
      email
      createdAt
      bio
      postCount
      commentCount
      daos
    }
  }
`;

export default function MainPage({ userId }: { userId: string }) {
  const { data, loading, error } = useQuery(getUserByIdQuery, {
    variables: { userById: userId },
    pollInterval: 5000,
  });

  // State to track the active tab
  const [activeTab, setActiveTab] = useState('Public');
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :{error.message}</p>;

  const user: User = data.userById;
  const handleTab = (tab: string) => {
    setActiveTab(tab);
  };

  // Function to render the appropriate PostsFeed based on the active tab
  const renderPostsFeed = () => {
    switch (activeTab) {
      case 'Subscribed':
        // return <BestPostsFeed />;
        return <SubscribedFeed user={user} />;
      case 'DAO Subscription':
        // return <HotPostsFeed />;
        return <PublicPostsFeed />;
      case 'User Subscriptions':
        // return <NewPostsFeed />;
        return <PublicPostsFeed />;
      case 'Public':
        // return <TopPostsFeed />;
        return <PublicPostsFeed />;
      default:
        return null;
    }
  };
  if (!user) {
    return (
      <main className="bg-gray-100 min-h-screen p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex gap-8">
            <div className="flex flex-col w-3/5 space-y-6">
              {/* Tab Bar */}
              <div className="bg-white rounded-lg shadow-md mb-4 p-4 flex justify-between text-gray-500">
                {[
                  'Subscribed',
                  'DAO Subscription',
                  'User Subscriptions',
                  'Public',
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-medium text-sm ${
                      activeTab === tab ? 'text-blue-600' : ''
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              {/* PostsFeed Components */} {renderPostsFeed()}
            </div>
            <div className="w-2/5">
              {/* Sidebar Component */}
              <CreateSidebar />{' '}
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex gap-8">
          <div className="flex flex-col w-3/5 space-y-6">
            <CreatePostForm user={user as User} />

            {/* Tab Bar */}
            <div className="bg-white rounded-lg shadow-md mb-4 p-4 flex justify-between text-gray-500">
              {[
                'Subscribed',
                'DAO Subscription',
                'User Subscriptions',
                'Public',
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-medium text-sm ${
                    activeTab === tab ? 'text-blue-600' : ''
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {/* PostsFeed Components */}
            {renderPostsFeed()}
          </div>
          <div className="w-2/5">
            {/* Sidebar Component */}
            <CreateSidebar />{' '}
          </div>
        </div>
      </div>
    </main>
  );
}
