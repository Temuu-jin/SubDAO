'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logoutIcon from '../../../public/logoutIcon.svg';
import { logout } from '../../actions';

export default function Signout() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await logout();
        router.refresh();
      }}
      className=" text-white  flex flex-row text-left gap-2 gap-4 px-3 py-1 rounded-md hover:bg-grey"
    >
      <Image src={logoutIcon} width={20} height={20} alt="logout-svg" />

      <span>Signout</span>
    </button>
  );
}
