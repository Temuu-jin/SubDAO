import '../../globals.css';
import React from 'react';
import SinglePost from '../../components/SinglePost';

export default function ViewPost() {
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto bg-white rounded shadow p-4">
        <div className="flex items-center justify-center">
          <SinglePost />
        </div>
      </div>
    </main>
  );
}
