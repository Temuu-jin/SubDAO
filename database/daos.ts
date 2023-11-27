import { cache } from 'react';
import { Dao } from '../util/types';
import { sql } from './connect';

export const getDaos = cache(async () => {
  const daos = await sql<Dao[]>`
    SELECT
      *
    FROM
      daos
  `;
  return daos;
});

export const getDaoById = cache(async (id: number) => {
  const [dao] = await sql<Dao[]>`
    SELECT
      *
    FROM
      daos
    WHERE
      id = ${id}
  `;
  return dao;
});

export const getDaoByUserId = cache(async (userId: number) => {
  const [dao] = await sql<Dao[]>`
    SELECT
      *
    FROM
      daos
    WHERE
      created_by = ${userId}
  `;
  return dao;
});

export const createDao = cache(
  async (name: string, description: string, userId: string) => {
    const [newDao] = await sql<Dao[]>`
      INSERT INTO
        daos (
          NAME,
          description,
          created_by
        )
      VALUES
        (
          ${name},
          ${description},
          ${userId}
        )
      RETURNING
        *
    `;
    return newDao;
  },
);

export const deleteDao = cache(async (id: number) => {
  const [dao] = await sql<Dao[]>`
    DELETE FROM daos
    WHERE
      id = ${id}
    RETURNING
      *
  `;
  return dao;
});

export const getDaosFromUser = async (daos: number[]) => {
  const daoList = await Promise.all(
    daos.map(async (id) => {
      const dao = await sql<Dao[]>`
        SELECT
          *
        FROM
          daos
        WHERE
          id = ${id}
      `;
      return dao[0];
    }),
  );
  return daoList as Dao[];
};

export const memberPlusOne = async (id: number) => {
  const [dao] = await sql<Dao[]>`
    UPDATE daos
    SET
      member_count = member_count + 1
    WHERE
      id = ${id}
    RETURNING
      *
  `;
  return dao as Dao;
};

export const memberMinusOne = async (id: number) => {
  const [dao] = await sql<Dao[]>`
    UPDATE daos
    SET
      member_count = member_count - 1
    WHERE
      id = ${id}
    RETURNING
      *
  `;
  return dao as Dao;
};
