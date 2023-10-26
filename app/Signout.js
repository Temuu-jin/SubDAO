'use client';
import { useRouter } from 'next/navigation';
import { logout } from './actions';

export default function Signout() {
  const router = useRouter();

  return (
    <form>
      <button
        formAction={async () => {
          await logout();
          await router.refresh();
        }}
      >
        Signout
      </button>
    </form>
  );
}
