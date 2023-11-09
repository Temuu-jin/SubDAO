import { jwtVerify } from 'jose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getParsedCookie } from './cookies';
import { User } from './types';

export const getJwtSecretKey = () => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey || secretKey.length === 0) {
    throw new Error('JWT_SECRET is not set');
  }
  return secretKey;
};

export const checkLogin = async () => {
  const token = await cookies().get('sessionToken')?.value.toString();
  if (!token) {
    return false;
  }
  const verified = await jwtVerify(
    token,
    new TextEncoder().encode(getJwtSecretKey()),
  );
  return verified ? true : false;
};

export const getJWT = async () => {
  const token = await cookies().get('sessionToken')?.value.toString();

  const tokenVerified: jwt.JwtPayload = jwt.verify(
    token!,
    process.env.JWT_SECRET!,
  ) as jwt.JwtPayload;

  return tokenVerified.payload;
};
export type GetUserResponse = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  bio: string;
  postCount: number;
  commentCount: number;
  userSubs: number;
};
export const getUser = async () => {
  const dataString: string = await getParsedCookie().toString();
  const user: JwtPayload | null = jwt.decode(dataString) as JwtPayload;

  return user as GetUserResponse;
};

export const createSessionToken = async (user: User) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    bio: user.bio,
    postCount: user.postCount,
    commentCount: user.commentCount,
    userSubs: user.userSubs,
  };
  const options = {
    expiresIn: '1h',
  };
  const sessionToken = await jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    options,
  );
  return sessionToken;
};

export const createRefreshToken = async (user: User) => {
  const payload = {
    id: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '7d', // Refresh token expires in 7 days
  };
  const refreshToken = await jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    options,
  );
  return refreshToken;
};
