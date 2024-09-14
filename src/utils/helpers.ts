import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';


export const generateJWT = (
  payload: { _id: Types.ObjectId }, secretKey: string, timeToExpire: number | string) => {
  return jwt.sign(payload, secretKey, { expiresIn: timeToExpire });
};

export const verifyJWT = <T = JwtPayload>(token: string, secretKey: string): T => {
  return jwt.verify(token, secretKey) as T;
};
