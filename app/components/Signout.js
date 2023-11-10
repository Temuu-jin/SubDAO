'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logoutIcon from '../../public/logoutIcon.svg';
import { logout } from '../actions';

export default function Signout() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await logout();
        await router.refresh();
      }}
      className="bg-red-600 text-white rounded-md hover:bg-red-700 flex flex-row text-left gap-2"
    >
      <Image src={logoutIcon} width={20} height={20} alt="logout-svg" />

      <span>Signout</span>
    </button>
  );
}
