import { cookies } from 'next/headers';

export function getParsedCookie() {
  const sessionToken = cookies().get('sessionToken')?.value;
  return sessionToken ? sessionToken : [];
}
