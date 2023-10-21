import '../globals.css';
import React from 'react';
import ProfileBanner from './ProfileBanner';

export default function Profile() {
  return (
    <main>
      <div className="siteContainer">
        <div className="px-[12em] py-[1em]   bg-[#DAE0E6] align-center box-border flex flex-row justify-center">
          <div className="min-w-[1120px] max-w-[1120px]">
            <ProfileBanner />
          </div>
        </div>
      </div>
    </main>
  );
}
