'use server';
import { cookies } from 'next/headers';
import { getParsedCookie } from '../util/cookies';

export async function logout() {
  await cookies().delete('sessionToken');
}
