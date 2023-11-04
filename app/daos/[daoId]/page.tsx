import '../../globals.css';
import { notFound } from 'next/navigation';
import { getDaoById } from '../../../database/daos';
import { getUserById } from '../../../database/users';
import { User } from '../../../util/types';
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

  console.log('user.id', user.id);
  console.log('dao.id', dao.id);

  return (
    <main>
      <div className="flex-col">
        {user?.daos.includes(parseInt(props.params.daoId)) === true ? (
          <LeaveDaoButton
            userId={user.id ? user.id.toString() : ''}
            daoId={dao.id.toString()}
          />
        ) : (
          <JoinDaoButton
            userId={user.id ? user.id.toString() : ''}
            daoId={dao.id.toString()}
          />
        )}
        <h1 className="flex justify-center text-xl">{dao.name}</h1>
        <p className="flex justify-center text-xs">{dao.description}</p>
        <p className="flex justify-center text-xs">
          Created by: {user?.username}
        </p>

        <DaoPosts daoId={props.params.daoId} />
      </div>

      {/* If you have a component like "AddQuantity" for DAOs, add it here */}
    </main>
  );
}
