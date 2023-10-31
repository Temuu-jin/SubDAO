import './globals.css';
import React from 'react';
import CreateSidebar from './components/CreateSidebar';
import Post from './components/Post';

export default function Home() {
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
