'use client';
import { useRouter } from 'next/navigation';
import { logout } from '../actions';

export default function Signout() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await logout();
        await router.refresh();
      }}
      className="bg-red-600 text-white my-1 px-1.5 rounded-md hover:bg-red-700 block"
    >
      Signout
    </button>
  );
}
