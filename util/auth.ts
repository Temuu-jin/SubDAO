import { jwtVerify } from 'jose';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
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
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey()),
    );
    return verified ? true : false;
  } catch (err) {
    console.log('no token, cant verify', err);
  }
};

export const getJWT = async () => {
  const token = await cookies().get('sessionToken')?.value.toString();

  const tokenVerified: jwt.JwtPayload = jwt.verify(
    token!,
    process.env.JWT_SECRET!,
  ) as jwt.JwtPayload;
  console.log('tokenVerified:', tokenVerified);

  return tokenVerified.payload;
};

export const getUserId = async () => {
  const token = await cookies().get('sessionToken')?.value.toString();
  const tokenVerified = jwt.verify(
    token!,
    process.env.JWT_SECRET!,
  ) as jwt.JwtPayload;
  console.log('tokenVerified:', tokenVerified);
  const tokenId = tokenVerified.userId!;
  if (!tokenId) {
    throw new Error('No user id found');
  }
  console.log('tokenVerified:', tokenVerified);
  return parseInt(tokenId);
};

export const createSessionToken = async (user: User) => {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
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
