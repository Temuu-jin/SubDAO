import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="w-full bg-gray-300 flex flex-row z-10 justify-around h-10 items-center">
          <div className="flex ">Logo</div>
          <div className="flex flex-row gap-20">
            <Link href="/">Feed</Link>
            <Link href="/">DAOs</Link>
            <Link href="/">About Us</Link>
          </div>
          <div className="flex ">Profile</div>
        </nav>
        {children}
      </body>
    </html>
  );
}
