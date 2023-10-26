/* import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('sessionToken')?.value;

  const verifiedToken =
    token &&
    (await verifyAuth(token).catch((err) => {
      console.log(err);
    }));
}

export const config = {
  matcher: ['/login', '/profile'],
};
 */
