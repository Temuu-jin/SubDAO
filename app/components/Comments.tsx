'use client';

import { gql, useQuery } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import { GetUserResponse } from '../../util/auth';
import { Comment, CommentWithUsername, Post, User } from '../../util/types';

const getCommentsByPostQuery = gql`
  query CommentsByPost($postId: ID!) {
    commentsByPost(postId: $postId) {
      id
      body
      userId
      postId
      commentId
      createdAt
      updatedAt
    }
  }
`;
type CommentsProps = {
  loggedUser?: GetUserResponse;
  comments: CommentWithUsername[];
};
export default function Comments({ loggedUser, comments }: CommentsProps) {
  console.log('comments: ', comments);
  if (loggedUser) {
    console.log('loggedUser = true');
    if (comments.length > 0) {
      return (
        <div>
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 py-2">
              <p className="text-xs">{comment.body}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </p>
              <p className="text-xs text-gray-500">
                by {comment.user.username}
              </p>
            </div>
          ))}
        </div>
      );
    }
  } else {
    console.log('loggedUser = false');
    console.log('comments: ', comments);
    if (comments.length > 0) {
      return (
        <div>
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 py-1">
              <p className="text-xs">{comment.body}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </p>
              <p className="text-xs text-gray-500">
                by {comment.user.username}
              </p>
            </div>
          ))}
        </div>
      );
    }
  }
}
