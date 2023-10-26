import { cookies } from 'next/headers';

export function getParsedCookie() {
  const cartCookieString = cookies().get('sessionToken')?.value;
  console.log('cartCookieString', cartCookieString);
  return cartCookieString ? cartCookieString : [];
}
