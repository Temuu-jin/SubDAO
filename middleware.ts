import { NextRequest, NextResponse } from 'next/server';
import { checkLogin } from './util/auth';

export async function middleware(req: NextRequest) {
  const loggedIn = await checkLogin();

  if (req.nextUrl.pathname.startsWith('/profile') && loggedIn === false) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (req.nextUrl.pathname.startsWith('/login') && loggedIn === true) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }
  if (req.nextUrl.pathname.startsWith('/createdao') && loggedIn === false) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (req.nextUrl.pathname.startsWith('/createpost') && loggedIn === false) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (req.nextUrl.pathname.startsWith('/createcomment') && loggedIn === false) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
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
