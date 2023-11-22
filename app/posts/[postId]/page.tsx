import '../../globals.css';
import React from 'react';
import { getCommentsByPostId } from '../../../database/comments';
import {
  getPostById,
  getSinglePostWithCommentsAndVotes,
} from '../../../database/posts';
import { getUserById } from '../../../database/users';
import { getUser } from '../../../util/auth';
import {
  Comment,
  Post,
  PostWithCommentsAndVotes,
  User,
} from '../../../util/types';
import SinglePost from '../../components/SinglePost';

type SinglePostPageProps = {
  params: {
    postId: string;
  };
};
export default async function singlePostPage(props: SinglePostPageProps) {
  const userAuth = await getUser();
  const post = (await getSinglePostWithCommentsAndVotes(
    Number(props.params.postId),
  )) as PostWithCommentsAndVotes;

  if (!userAuth) {
    return <SinglePost post={post} />;
  } else {
    return <SinglePost user={userAuth} post={post} />;
  }
}
