import './globals.css';
import React from 'react';
import CreateSidebar from './components/CreateSidebar';
import Post from './components/Post';

export default function Home() {
  return (
    <main>
      <div className="px-40">
        <div className=" ">
          <div className="flex flex-col">
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
          <div className="">
            <CreateSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
