import { cache } from 'react';
import { Dao } from '../util/types';
import { sql } from './connect';

export const getDaos = cache(async () => {
  const daos = await sql<Dao[]>`SELECT * FROM daos`;
  console.log('daos: ', daos);
  return daos;
});

export const getDaoById = cache(async (id: number) => {
  const [dao] = await sql<Dao[]>`SELECT * FROM daos WHERE id = ${id}`;
  return dao;
});

export const getDaoByUserid = cache(async (userId: number) => {
  const [dao] = await sql<Dao[]>`SELECT * FROM daos WHERE userId = ${userId}`;
  console.log('dao: ', dao);
  return dao;
});

export const createDao = cache(async (name: string, description: string) => {
  const [newDao] = await sql<Dao[]>`
    INSERT INTO daos (name, description)
    VALUES (${name}, ${description})
    RETURNING *`;
  return newDao;
});

export const deleteDao = cache(async (id: number) => {
  const [dao] = await sql<Dao[]>`
  DELETE FROM daos WHERE id = ${id}
  RETURNING *`;
  return dao;
});
