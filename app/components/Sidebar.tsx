'use client';
import '../globals.css';
import Image from 'next/image';
import Link from 'next/link';
import daos from '../../public/daos.svg';
import home from '../../public/home.svg';
import messagesIcon from '../../public/messagesIcon.svg';
import moreIcon from '../../public/moreIcon.svg';
import notificationsIcon from '../../public/notificationsIcon.svg';
import profileIcon from '../../public/profileIcon.svg';
import { GetUserResponse } from '../../util/auth';
import Signout from './auth/Signout';

type SidebarProps = {
  verifiedToken?: void | '' | GetUserResponse | undefined;
};

export default function Sidebar({ verifiedToken }: SidebarProps) {
  return (
    <div>
      <nav>
        <div className="">
          <div className="fixed flex flex-col text-left gap-10">
            <div className="my-3 w-7 rounded-full overflow-hidden">
              <Image
                alt="logo"
                objectFit="cover"
                src="/logo.png"
                width={30}
                height={30}
              />
            </div>
            {verifiedToken === undefined || verifiedToken === '' ? (
              <>
                <div className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey">
                  <Image src={home} width={20} height={20} alt="home-svg" />

                  <Link href="/">Home</Link>
                </div>
                <div className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey">
                  <Image src={daos} width={20} height={20} alt="daos-svg" />
                  <Link href="/daos">DAOs</Link>
                </div>

                <Link
                  href="/aboutus"
                  className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey"
                >
                  About
                </Link>
                <div className="  flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey"
                    data-test-id="link-signup"
                  >
                    Signup
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey"
                >
                  <Image src={home} width={20} height={20} alt="home-svg" />
                  <div>Home</div>
                </Link>

                <Link
                  href="/daos"
                  className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey"
                >
                  <Image src={daos} width={20} height={20} alt="daos-svg" />
                  <div>DAOs</div>
                </Link>
                <button className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey">
                  <Image
                    src={notificationsIcon}
                    width={20}
                    height={20}
                    alt="home-svg"
                  />
                  <span>Notifications</span>
                </button>
                <button className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey">
                  <Image
                    src={messagesIcon}
                    width={20}
                    height={20}
                    alt="home-svg"
                  />
                  <span>Messages</span>
                </button>
                <div className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey">
                  <Image
                    src={profileIcon}
                    width={20}
                    height={20}
                    alt="home-svg"
                  />

                  <Link
                    href={`/profile/${verifiedToken.id}`}
                    className=" text-white  block"
                  >
                    Profile
                  </Link>
                </div>
                <button className="flex flex-row gap-4 px-3 py-1 rounded-md hover:bg-grey">
                  <Image src={moreIcon} width={20} height={20} alt="home-svg" />
                  <span>More</span>
                </button>
                <div className="fixed bottom-8">
                  <Signout />
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
