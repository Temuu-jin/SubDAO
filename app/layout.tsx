import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import daos from '../public/DAOs.svg';
import home from '../public/home.svg';
import messagesIcon from '../public/messagesIcon.svg';
import moreIcon from '../public/moreIcon.svg';
import notificationsIcon from '../public/notificationsIcon.svg';
import profileIcon from '../public/profileIcon.svg';
import searchIcon from '../public/searchIcon.svg';
import { checkLogin } from '../util/auth';
import { ApolloClientProvider } from './ApolloClientProvider';
import Signout from './components/Signout.js';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SubDAO',
  description: 'Create and join Communities',
};

async function verifyLogin() {
  const sessionCookie = cookies().get('sessionToken');
  if (sessionCookie) {
    const auth = await checkLogin(sessionCookie.toString());
    if (auth) {
      return true;
    }
    return false;
  } else {
    return false;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get('sessionToken')?.value;
  const verifiedToken =
    token &&
    (await checkLogin(token).catch((err) => {
      console.log(err);
    }));
  console.log('verifiedToken', verifiedToken);
  return (
    <html lang="en">
      <body>
        <div>
          <div className="text-center p-2 h-12">subdApp</div>
          <div
            className={`grid xl:grid-cols-12 lg:grid-cols-12 md:grid-cols-12 sm: ${inter.className}`}
          >
            <div className="xl:col-span-2 xl:block lg:col-span-1 lg:block md:hidden sm:hidden" />
            <aside className="xl:col-span-1 lg:col-span-2 md:col-span-2 sm: text-right    p-2 ">
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
                    {verifiedToken === undefined ? (
                      <>
                        <div className="flex flex-row gap-4">
                          <Image
                            src={home}
                            width={20}
                            height={20}
                            alt="home-svg"
                          />

                          <Link href="/">Home</Link>
                        </div>
                        <div className="flex flex-row gap-4">
                          <Image
                            src={daos}
                            width={20}
                            height={20}
                            alt="daos-svg"
                          />
                          <Link href="/daos">DAOs</Link>
                        </div>

                        <Link href="/aboutus">About</Link>
                        <div className="  flex flex-col gap-2">
                          <Link href="/login">Login</Link>
                          <Link href="/signup" data-test-id="link-signup">
                            Signup
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link href="/" className="flex flex-row gap-4">
                          <Image
                            src={home}
                            width={20}
                            height={20}
                            alt="home-svg"
                          />
                          <div>Home</div>
                        </Link>

                        <Link href="/daos" className="flex flex-row gap-4">
                          <Image
                            src={daos}
                            width={20}
                            height={20}
                            alt="daos-svg"
                          />
                          <div>DAOs</div>
                        </Link>
                        <div className="flex flex-row gap-4">
                          <Image
                            src={notificationsIcon}
                            width={20}
                            height={20}
                            alt="home-svg"
                          />
                          <span>Notifications</span>
                        </div>
                        <div className="flex flex-row gap-4">
                          <Image
                            src={messagesIcon}
                            width={20}
                            height={20}
                            alt="home-svg"
                          />
                          <span>Messages</span>
                        </div>
                        <div className="flex flex-row gap-4">
                          <Image
                            src={profileIcon}
                            width={20}
                            height={20}
                            alt="home-svg"
                          />
                          <Link href="/profile" className=" text-white  block">
                            Profile
                          </Link>
                        </div>
                        <div className="flex flex-row gap-4">
                          <Image
                            src={moreIcon}
                            width={20}
                            height={20}
                            alt="home-svg"
                          />
                          <span>More</span>
                        </div>
                        <div className="fixed bottom-8">
                          <Signout />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </nav>
            </aside>
            <div className="ml-4 xl:col-span-7 lg:col-span-7 md:col-span-9 sm:  ">
              <ApolloClientProvider>{children}</ApolloClientProvider>
            </div>
            <div className=" xl:col-span-2 xl:block lg:col-span-2 lg:block md:col-span-1 md:block sm:hidden" />
          </div>
        </div>
      </body>
    </html>
  );
}
