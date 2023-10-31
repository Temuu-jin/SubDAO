'use client';
import '../globals.css';
import React from 'react';

export default function Profile(profile) {
  return (
    <div>
      <div className="card w-[100%] p-[1px]  h-[344px] glass  my-8 align-bottom ">
        <h1>Welcome {profile.username}</h1>
      </div>
    </div>
  );
}
