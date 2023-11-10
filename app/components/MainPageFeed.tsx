'use client';
import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
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

  const [isExpanded, setIsExpanded] = useState(true);
  const [isFixed, setIsFixed] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition > 200) {
      // adjust this value as needed
      setIsExpanded(false);
      setIsFixed(true);
      console.log('isExpanded > 10: ', isExpanded);
    } else {
      setIsExpanded(true);
      setIsFixed(false);
      console.log('isExpanded: ', isExpanded);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('Public');
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :{error.message}</p>;

  const user: User = data.userById;

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
      <main className=" min-h-screen p-4">
        <div className="xl:col-span-5 lg:col-span-7 md:col-span-7 sm:col-span-7">
          {/* Tab Bar */}
          <div className="flex flex-row justify-between bg-white h-40 mb-4  text-gray-500">
            {[
              'Subscribed',
              'DAO Subscription',
              'User Subscriptions',
              'Public',
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex font-medium text-sm ${
                  activeTab === tab ? 'text-blue-600' : ''
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* PostsFeed Components */} {renderPostsFeed()}
        </div>
      </main>
    );
  }
  return (
    <main className="grid grid-cols-7 w-[100%] px-4 py-4">
      <div className="xl:col-span-5 lg:col-span-7 md:col-span-7 sm:col-span-7">
        {isFixed === false ? (
          <div>
            <CreatePostForm user={user as User} />
          </div>
        ) : (
          <div>
            {isExpanded ? (
              <div>
                <button onClick={() => setIsExpanded(false)}>x</button>
                <CreatePostForm user={user as User} />
              </div>
            ) : (
              <div
                onClick={() => setIsExpanded(true)}
                onKeyPress={() => setIsExpanded(true)}
                role="button"
                tabIndex={0}
                className="sticky top-0 p-4"
              >
                Create a post...
              </div>
            )}
          </div>
        )}

        <div className="flex h-12 justify-center gap-6 mt-2 mb-0">
          {[
            'Subscribed',
            'DAO Subscription',
            'User Subscriptions',
            'Public',
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-medium text-sm border border-grey rounded-t-xl border-b-0 px-2 ${
                activeTab === tab ? 'bg-grey' : ''
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {/* PostsFeed Components */}
        {renderPostsFeed()}
      </div>
      <div className="xl:col-span-2 xl:block lg:hidden md:hidden sm:hidden min-h-full px-4">
        <CreateSidebar />
      </div>
    </main>
  );
}
