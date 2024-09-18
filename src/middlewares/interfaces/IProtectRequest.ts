import { Request } from 'express';

import { Role } from '../../models/interfaces/IUser';

export default interface IProtectRequest extends Request {
  user?: {
    name: string;
    email: string;
    password?: string;
    verified: boolean;
    active: boolean;
    role: Role;
    createdAt?: Date;
  };
}
