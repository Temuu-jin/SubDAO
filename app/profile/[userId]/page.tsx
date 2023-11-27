import jwt from 'jsonwebtoken';
import { getCldImageUrl } from 'next-cloudinary';
import { getPostWithCommentsAndVotesByUser } from '../../../database/posts';
import { getUserById } from '../../../database/users';
import { GetUserResponse } from '../../../util/auth';
import { getParsedCookie } from '../../../util/cookies';
import PostInFeed from '../../components/PostInFeed';
import ProfilePage from '../../components/ProfilePage';

type SinglePostPageProps = {
  params: {
    userId: string;
  };
};

export default async function Profile(props: SinglePostPageProps) {
  // const data = await getUserById();
  const dataString: string = await getParsedCookie().toString();
  const loggedUser = jwt.decode(dataString) as GetUserResponse;
  const user = await getUserById(parseInt(props.params.userId));
  const posts = await getPostWithCommentsAndVotesByUser(
    parseInt(props.params.userId),
  );
  const url = getCldImageUrl({
    width: 960,
    height: 600,
    src: loggedUser.image,
  });
  let ownProfile = false;
  if (user) {
    user.id === parseInt(props.params.userId)
      ? (ownProfile = true)
      : (ownProfile = false);
  }
  return (
    <ProfilePage
      user={user}
      posts={posts}
      ownProfile={ownProfile}
      loggedUser={loggedUser}
    />
  );
}
