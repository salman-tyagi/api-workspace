import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const generateJWT = (
  payload: { _id: Types.ObjectId },
  secretKey: string,
  timeToExpire: number | string
): string => {
  return jwt.sign(payload, secretKey, {
    expiresIn: timeToExpire
  });
};

export default generateJWT;
