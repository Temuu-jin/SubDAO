import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { checkLogin } from './util/auth';

export async function middleware(req: NextRequest) {
  const token = cookies().get('sessionToken')?.value;
  const verifiedToken =
    token &&
    (await checkLogin(token).catch((err) => {
      console.log(err);
    }));

  if (req.nextUrl.pathname.startsWith('/login') && verifiedToken) {
    return NextResponse.redirect(new URL(`/`, req.url));
  }
  if (req.nextUrl.pathname.startsWith('/profile') && !verifiedToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (req.nextUrl.pathname.startsWith('/createdao') && !verifiedToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (req.nextUrl.pathname.startsWith('/createpost') && !verifiedToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (req.nextUrl.pathname.startsWith('/createcomment') && !verifiedToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/login',
    '/profile',
    '/createdao',
    '/createpost',
    '/createcomment',
  ],
};
