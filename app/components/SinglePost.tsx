'use client';

import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { GetUserResponse } from '../../util/auth';
import { PostWithCommentsAndVotes } from '../../util/types';
import Comments from './Comments';
import CreateCommentForm from './CreateCommentForm';

type SinglePostPageProps = {
  user?: GetUserResponse;
  post: PostWithCommentsAndVotes;
};
export default function SinglePost({ user, post }: SinglePostPageProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const loggedIn = user ? true : false;
  return (
    <>
      <div className="flex">
        <div className="flex flex-col justify-center items-center mr-4 text-gray-400">
          <button aria-label="upvote">
            <svg
              className="h-6 w-6 hover:text-solanaGreen"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <span className="text-xs">Vote</span>
          <button aria-label="downvote">
            <svg
              className="h-6 w-6 hover:text-[#ff4500]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        <div className="flex-shrink-0 mr-4 pt-5">
          <Image
            src="https://i.redd.it/75dkc76f6xyb1.jpg"
            className="h-20 w-20"
            width={200}
            height={200}
            alt="Post avatar"
          />
        </div>
        <div className="flex-grow">
          <div className="">
            {post.daoId > 0 ? (
              <span className="text-xs font-semibold hover:underline">
                d/{post.dao.name}
                <span className="text-xs text-gray-400"> • </span>
              </span>
            ) : null}
            <span className="text-xs font-semibold hover:underline">
              u/{post.user.username}{' '}
            </span>
            {' - '}
            <span className="justify-end text-xs font-semibold hover:underline">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <a
            href={`/posts/${post.id}`}
            className="text-lg font-semibold hover:text-solanaPurple hover:underline"
          >
            {post.title}
          </a>
          <p className="text-sm mt-1">{post.body}</p>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="mt-2">
        {user ? (
          <CreateCommentForm
            userId={parseInt(user.id)}
            postId={post.id}
            commentId={null}
          />
        ) : (
          <Link href="/login" className="text-xs">
            Login to Comment{' '}
          </Link>
        )}
      </div>
      <Comments loggedUser={user} comments={post.comments} />
    </>
  );
}
