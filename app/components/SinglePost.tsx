import '../globals.css';
import Link from 'next/link';
import React from 'react';

export default function SinglePost() {
  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <Link href="/viewpost/1">
        <a>
          <h1 className="text-xl font-bold mb-2">
            I am a Post-Title in DAO Placeholder 1
          </h1>
          <p>This is my super duper amazing post...</p>
        </a>
      </Link>
    </div>
  );
}
