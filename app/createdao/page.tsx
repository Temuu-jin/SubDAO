import '../globals.css';
import { getUserId } from '../../util/auth';
import CreateDaoForm from '../components/CreateDaoForm';

export default async function CreateDao() {
  const userId = await getUserId();

  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto bg-white rounded shadow p-4">
        <div className="siteContainer flex items-center justify-center">
          <CreateDaoForm userId={userId} />
        </div>
      </div>
    </main>
  );
}
