import { cache } from 'react';
import { Membership } from '../util/types';
import { sql } from './connect';

export const addMembershipDao = cache(
  async (userId: number, daoId: number, role: string = 'member') => {
    const [membership] = await sql<Membership[]>`
    INSERT INTO memberships (user_id, dao_id, role)
    VALUES (${userId}, ${daoId}, ${role})
    RETURNING *`;
    return membership;
  },
);

export const addMembershipSub = cache(
  async (userId: number, subId: number, role: string = 'member') => {
    const [membership] = await sql<Membership[]>`
    INSERT INTO memberships (user_id, sub_to_user_id, role)
    VALUES (${userId}, ${subId}, ${role})
    RETURNING *`;
    return membership;
  },
);

export const updateMembershipRole = cache(
  async (userId: number, daoId: number, newRole: string) => {
    const [membership] = await sql<Membership[]>`
    UPDATE memberships
    SET role = ${newRole}
    WHERE user_id = ${userId} AND dao_id = ${daoId}
    RETURNING *`;
    return membership;
  },
);
export const removeMembership = cache(async (userId: number, daoId: number) => {
  await sql`
    DELETE FROM memberships
    WHERE user_id = ${userId} AND dao_id = ${daoId};
  `;
});
export const makeMemberAdmin = cache(async (userId: number, daoId: number) => {
  const [membership] = await sql<Membership[]>`
    UPDATE memberships
    SET role = 'admin'
    WHERE user_id = ${userId} AND dao_id = ${daoId}
    RETURNING *`;
  return membership;
});
export const removeAdmin = cache(async (userId: number, daoId: number) => {
  const [membership] = await sql<Membership[]>`
    UPDATE memberships
    SET role = 'member'
    WHERE user_id = ${userId} AND dao_id = ${daoId}
    RETURNING *`;
  return membership;
});
export const getAllMembersInDao = cache(async (daoId: number) => {
  const members = await sql<Membership[]>`
    SELECT * FROM memberships
    WHERE dao_id = ${daoId}`;
  return members;
});

export const getAllUserMemberships = cache(async (userId: number) => {
  const memberships = await sql<Membership[]>`
    SELECT * FROM memberships
    WHERE user_id = ${userId}`;
  return memberships;
});
export const getAllUserDaoMemberships = cache(async (userId: number) => {
  const memberships = await sql<Membership[]>`
    SELECT * FROM memberships
    WHERE user_id = ${userId} AND dao_id IS NOT NULL`;
  return memberships;
});

export const getAllUserSubMemberships = cache(async (userId: number) => {
  const memberships = await sql<Membership[]>`
    SELECT * FROM memberships
    WHERE user_id = ${userId} AND sub_to_user_id IS NOT NULL`;
  return memberships;
});
