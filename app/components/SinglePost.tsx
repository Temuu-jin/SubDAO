import '../globals.css';
import Link from 'next/link';
import React from 'react';

export default function SinglePost() {
  return (
    <div>
      <Link href="/viewpost/1">
        <div className="card w-[100%] p-[1px]  h-[344px] glass  my-8 align-bottom px-6 flex flex-row ">
          <div className="flex flex-col w-[5%] h-[100%] items-center pt-3">
            <div className="border border-black border-solid flex mt-4 mb-0 h-4 items-center w-4">
              +
            </div>
            <div className="border border-black border-solid flex mt-4 mb-0 h-4 items-center w-4">
              0
            </div>
            <div className="border border-black border-solid flex mt-4 mb-0 h-4 items-center w-4">
              -
            </div>
          </div>
          <div className="pl-6">
            <h1 className="text-lg my-8">
              I am a Post-Title in DAO Placeholder 1
            </h1>
            <p className="text-xs my-2">
              This is my super duper amazing post and I might add a picture,
              link or start a poll. I can get upvoted and upvote or downvote
              comments. Lets give it a Try!
            </p>
          </div>
          L
        </div>
      </Link>
    </div>
  );
}
