import { Request } from 'express';

import { Role } from '../../models/interfaces/IUser';
import { Types } from 'mongoose';

export default interface IProtectRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    verified: boolean;
    active: boolean;
    role: Role;
    createdAt?: Date;
  };
}
