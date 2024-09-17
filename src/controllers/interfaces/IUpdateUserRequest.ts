import { Request } from 'express';
import IUser from '../../models/interfaces/IUser';

export interface IUserWithId extends IUser {
  _id?: string;
}

export interface IUpdateUserRequest extends Request {
  body: { name: string; email: string };
  user: IUserWithId;
}
