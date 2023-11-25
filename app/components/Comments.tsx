'use client';

import { gql, useMutation } from '@apollo/client';
import { formatDistanceToNow, set } from 'date-fns';
import { useState } from 'react';
import { GetUserResponse } from '../../util/auth';
import { CommentWithUsername, Post, User } from '../../util/types';

type CommentsProps = {
  loggedUser?: GetUserResponse;
  comments: CommentWithUsername[];
};

const deleteCommentMutation = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(id: $commentId) {
      id
    }
  }
`;
export default function Comments({ loggedUser, comments }: CommentsProps) {
  const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(
    null,
  );
  const [deleteComment] = useMutation(deleteCommentMutation, {
    variables: {
      commentId: commentIdToDelete,
    },
    onError: (error) => {
      console.log(comments);
      console.log('onError', error);
    },
    onCompleted: () => {
      console.log('onCompleted');
    },
  });

  if (loggedUser) {
    if (comments.length > 0) {
      return (
        <div>
          {comments.map((comment) => (
            <div key={comment.id} className="py-2 px-3">
              <div className="flex flex-row justify-between">
                <div className="flex">
                  <p className="text-xs text-gray-500">
                    /u/{comment.user.username}
                    {' - '}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {loggedUser.username === comment.user.username ? (
                  <button
                    onClick={async () => {
                      await setCommentIdToDelete(comment.id);
                      await deleteComment();
                    }}
                    className="text-[#FF0000]"
                  >
                    X
                  </button>
                ) : null}
              </div>
              <p className="text-xs">{comment.body}</p>
            </div>
          ))}
        </div>
      );
    }
  } else {
    if (comments.length > 0) {
      return (
        <div>
          {comments.map((comment) => (
            <div key={comment.id} className="py-2 px-3">
              <div className="flex flex-row justify-between">
                <div className="flex">
                  <p className="text-xs text-gray-500">
                    /u/{comment.user.username}
                    {' - '}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <p className="text-xs">{comment.body}</p>
            </div>
          ))}
        </div>
      );
    }
  }
}
