import { cookies } from 'next/headers';

export function getParsedCookie() {
  const sessionToken = cookies().get('sessionToken')?.value;
  return sessionToken ? sessionToken : [];
}

export const setCookies = (sessionToken: string) => {
  cookies().set('sessionToken', sessionToken, {
    httpOnly: true,
    maxAge: 60 * 60,
  });
};
