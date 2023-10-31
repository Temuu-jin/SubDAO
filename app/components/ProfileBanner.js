'use client';
import '../globals.css';
import React from 'react';

export default function Profile(profile) {
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome {profile.username}</h1>
      </div>
    </div>
  );
}
