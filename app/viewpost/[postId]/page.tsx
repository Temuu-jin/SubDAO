import '../../globals.css';
import React from 'react';
import SinglePost from '../../components/SinglePost';

export default function ViewPost() {
  return (
    <main>
      <div className="siteContainer">
        <div className="px-[10em] py-[1em]   bg-[#DAE0E6] align-center box-border flex flex-row justify-center">
          <div className="min-w-[1120px] max-w-[1120px]">
            <SinglePost />
          </div>
        </div>
      </div>
    </main>
  );
}
