import '../../globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDaoById } from '../../../database/daos';
import { getUserById } from '../../../database/users';

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
  // const daoPosts = await getPostsByDaoId(Number(props.params.daoId));
  const creator = await getUserById(Number(dao?.createdBy));
  if (!dao) {
    return notFound();
  }

  return (
    <main>
      <div className="flex-col">
        <h1 className="flex justify-center text-xl">{dao.name}</h1>
        <p className="flex justify-center text-xs">{dao.description}</p>
        <p className="flex justify-center text-xs">
          Created by: {creator?.username}
        </p>

        {/* Link to detailed posts or any other related info
        {daoPosts.map(post => (
          <Link key={post.id} href={`/daos/${daoId}/posts/${post.id}`}>
            <a className="block">{post.title}</a>
          </Link>
        ))} */}
      </div>

      {/* If you have a component like "AddQuantity" for DAOs, add it here */}
    </main>
  );
}
