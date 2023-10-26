import { cookies } from 'next/headers';

export function getParsedCookie() {
  const sessionToken = cookies().get('sessionToken')?.value;
  console.log('sessionToken', sessionToken);
  return sessionToken ? sessionToken : [];
}
