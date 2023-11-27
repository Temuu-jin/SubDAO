import '../../globals.css';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { type } from 'os';
import { getDaoById } from '../../../database/daos';
import { getAllUserMemberships } from '../../../database/memberships';
import { getPostsByDaoId } from '../../../database/posts';
import { getUserById } from '../../../database/users';
import { checkLogin, getUser, GetUserResponse } from '../../../util/auth';
import CreatePostForm from '../../components/CreatePostForm';
import { DaoPosts } from '../../components/DaoPosts';
import JoinDaoButton from '../../components/JoinDaoButton';
import LeaveDaoButton from '../../components/LeaveDaoButton';
import PostInFeed from '../../components/PostInFeed';

type SingleDaoPageProps = {
  params: {
    daoId: string;
  };
};

export async function generateMetadata({ params }: SingleDaoPageProps) {
  const dao = await getDaoById(Number(params.daoId));
  return {
    title: dao ? dao.name : '',
    description: dao ? dao.description : '',
  };
}

export default async function SingleDaoPage(props: SingleDaoPageProps) {
  const dao = await getDaoById(Number(props.params.daoId));
  if (!dao) {
    return notFound();
  }
  // const daoPosts = await getPostsByDaoId(Number(props.params.daoId));

  const creator = await getUserById(dao.createdBy);
  const token = cookies().get('sessionToken')?.value;

  const loggedInUser =
    token &&
    (await await getUser().catch((err) => {
      console.log(err);
    }));
  if (!loggedInUser) {
    console.log('Not Logged In');
  }

  const loggedIn: boolean =
    loggedInUser === '' || loggedInUser === undefined || loggedInUser === null
      ? false
      : true;

  const allDaoPosts = await getPostsByDaoId(Number(props.params.daoId));
  const publicDaoPosts = allDaoPosts.filter(
    (post) => post.membersOnly === false,
  );
  const privateDaoPosts = allDaoPosts.filter(
    (post) => post.membersOnly === true,
  );

  if (loggedIn === false) {
    return (
      <main className="bg-gray-100 min-h-screen">
        {/* DAO Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{dao.name}</h1>
                <p className="text-gray-600">{dao.description}</p>
                <p className="text-gray-500 text-sm">
                  Created by: {creator?.username}
                </p>
              </div>
              <a href="/login">Login to Join DAO</a>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4">
          <h2 className="text-xl font-bold mb-2">Public Posts</h2>
          <ul>
            {publicDaoPosts.map((post) => {
              return (
                <div key={`post-${post.id}`}>
                  <PostInFeed post={post} />
                </div>
              );
            })}
          </ul>
        </div>
      </main>
    );
  }
  if (
    loggedIn === true &&
    loggedInUser !== undefined &&
    loggedInUser !== '' &&
    'id' in loggedInUser
  ) {
    const userDaoMemberships = await getAllUserMemberships(
      parseInt(loggedInUser.id),
    );
    console.log('userDaoMemberships', userDaoMemberships);
    const member = userDaoMemberships.find(
      (membership) => membership.daoId === dao.id,
    );
    return (
      <main className="bg-gray-100 min-h-screen">
        {/* DAO Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{dao.name}</h1>
                <p className="text-gray-600">{dao.description}</p>
                <p className="text-gray-500 text-sm">
                  Created by: {creator?.username}
                </p>
              </div>
              {member === undefined ? (
                <div>
                  <JoinDaoButton
                    userId={parseInt(loggedInUser.id)}
                    daoId={dao.id}
                  />
                </div>
              ) : (
                <div>
                  <LeaveDaoButton
                    userId={parseInt(loggedInUser.id)}
                    daoId={dao.id}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          {member !== undefined ? (
            <div className="container mx-auto px-4 py-4">
              <div className="mb-6">
                <div className="">
                  <CreatePostForm user={loggedInUser} />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* DAO Posts */}
        {member !== undefined ? (
          <div className="container mx-auto px-4 py-4">
            <h2 className="text-xl font-bold mb-2">Members Only Posts</h2>
            <ul>
              {privateDaoPosts.map((post) => {
                return (
                  <div key={`post-${post.id}`}>
                    <PostInFeed post={post} loggedUser={loggedInUser} />
                  </div>
                );
              })}
            </ul>
          </div>
        ) : null}
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-xl font-bold mb-2">Public Posts</h2>
          <ul>
            {publicDaoPosts.map((post) => {
              return (
                <div key={`post-${post.id}`}>
                  <PostInFeed post={post} loggedUser={loggedInUser} />
                </div>
              );
            })}
          </ul>
        </div>
      </main>
    );
  }
}
