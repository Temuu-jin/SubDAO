import { cookies } from 'next/headers';

export function getParsedCookie() {
  const sessionToken = cookies().get('sessionToken')?.value;
  return sessionToken ? sessionToken : [];
}

export const setCookies = (sessionToken: string, refreshToken: string) => {
  cookies().set('sessionToken', sessionToken, { httpOnly: true });
  cookies().set('refreshToken', refreshToken, { httpOnly: true });
};
