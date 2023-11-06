import '../../globals.css';
import { notFound } from 'next/navigation';
import { getDaoById } from '../../../database/daos';
import { getAllUserMemberships } from '../../../database/memberships';
import { getUserById } from '../../../database/users';
import { DaoPosts } from '../../components/DaoPosts';
import JoinDaoButton from '../../components/JoinDaoButton';
import LeaveDaoButton from '../../components/LeaveDaoButton';

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

  const user = await getUserById(dao.createdBy);

  if (!user) {
    return notFound();
  }
  const userDaoMemberships = await getAllUserMemberships(user.id);
  console.log('user.id', user.id);
  console.log('dao.id', dao.id);
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
                Created by: {user?.username}
              </p>
            </div>
            <div>
              {member ? (
                <LeaveDaoButton
                  userId={user.id ? user.id.toString() : ''}
                  daoId={dao.id.toString()}
                />
              ) : (
                <JoinDaoButton userId={user.id} daoId={dao.id} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for CreatePostForm area */}
      <div className="container mx-auto px-4 py-4">
        <div className="mb-6">
          {/* Replace this div with the CreatePostForm component when ready */}
          <div className="border border-dashed border-gray-300 rounded-lg h-40 flex justify-center items-center">
            <span className="text-gray-500">Create Post Form Placeholder</span>
          </div>
        </div>

        {/* DAO Posts */}
        <DaoPosts daoId={props.params.daoId} />
      </div>
    </main>
  );
}
