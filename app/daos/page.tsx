import '../globals.css';
import { redirect } from 'next/navigation';
import { getUser } from '../../util/auth';
import DaosPage from '../components/DaosPage';

export default async function Daos() {
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <DaosPage />
    </main>
  );
}
