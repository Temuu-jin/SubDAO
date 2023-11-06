import '../../../globals.css';
import React from 'react';
import { getCommentsByPostId } from '../../../../database/comments';
import { getPostById } from '../../../../database/posts';
import { getUserById } from '../../../../database/users';
import { getUser } from '../../../../util/auth';
import { Comment, Post, User } from '../../../../util/types';
import SinglePost from '../../../components/SinglePost';

type SinglePostPageProps = {
  params: {
    postId: string;
  };
};
export default async function singlePostPage(props: SinglePostPageProps) {
  const userAuth = await getUser();
  if (!userAuth) {
    console.log('no user auth');
  } else {
    const user = await getUserById(parseInt(userAuth.id));
    const post = (await getPostById(Number(props.params.postId))) as Post;
    const comments = (await getCommentsByPostId(
      Number(props.params.postId),
    )) as Comment[];
    console.log('post', post);
    console.log('comments', comments);
    return <SinglePost user={user as User} post={post} comments={comments} />;
  }
}
