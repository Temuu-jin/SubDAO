import { cache } from 'react';
import { User } from '../util/types';
import { sql } from './connect';

export const getUsers = cache(async () => {
  const users = await sql<User[]>`SELECT * FROM users`;
  return users;
});

export const getUserById = cache(async (id: number) => {
  const [user] = await sql<User[]>`SELECT * FROM users WHERE id = ${id}`;
  return user;
});
