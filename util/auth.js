import { jwtVerify } from 'jose';
import jwt from 'jsonwebtoken';

export const getJwtSecretKey = () => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey || secretKey.length === 0) {
    throw new Error('JWT_SECRET is not set');
  }
  return secretKey;
};

export const checkLogin = async (token) => {
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

export const getJWT = (token) => {
  const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);
  return tokenVerified;
};
