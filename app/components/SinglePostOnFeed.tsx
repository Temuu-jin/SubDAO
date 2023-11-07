'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Comment, Post, User } from '../../util/types';
import CreateCommentForm from './CreateCommentForm';

type SinglePostPageProps = {
  user: User;
  post: Post;
  comments: Comment[];
};
export default function SinglePost({
  user,
  post,
  comments,
}: SinglePostPageProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  if (!user) {
    return (
      <main className="bg-gray-100 min-h-screen p-4">
        <div className="container mx-auto bg-white rounded shadow p-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-2xl font-bold">{post?.title}</h1>
            <p className="text-lg">{post?.body}</p>
            {post?.createdAt ? (
              <p className="text-sm text-gray-500">
                {post?.createdAt.toString()}
              </p>
            ) : null}
            <div className="w-full">
              {comments ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-200 py-2"
                  >
                    <p className="text-base">{comment.body}</p>
                    <p className="text-sm text-gray-500">
                      {comment.createdAt.toString()}
                    </p>
                    <p className="text-sm text-gray-500">by {comment.userId}</p>
                  </div>
                ))
              ) : (
                <Link href="/login" className="text-blue-500 hover:underline">
                  Login to Comment
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto bg-white rounded shadow p-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl font-bold">{post?.title}</h1>
          <p className="text-lg">{post?.body}</p>
          {post?.createdAt ? (
            <p className="text-sm text-gray-500">
              {post?.createdAt.toString()}
            </p>
          ) : null}
          <div className="w-full">
            {comments ? (
              <div>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-200 py-2"
                  >
                    <p className="text-base">{comment.body}</p>
                    <p className="text-sm text-gray-500">
                      {comment.createdAt.toString()}
                    </p>
                    <p className="text-sm text-gray-500">by {comment.userId}</p>
                  </div>
                ))}

                {showCommentForm ? (
                  <div>
                    <CreateCommentForm
                      userId={user.id}
                      postId={post.id}
                      commentId={null}
                    />
                    <button onClick={() => setShowCommentForm(false)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowCommentForm(true)}>
                    Comment
                  </button>
                )}
              </div>
            ) : (
              <CreateCommentForm
                userId={user.id}
                postId={post.id}
                commentId={null}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
