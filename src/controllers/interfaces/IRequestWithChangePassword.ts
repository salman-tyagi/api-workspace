import { Request } from 'express';
import { IUserWithId } from './IUpdateUserRequest';

interface IRequestWithChangePassword extends Request {
  body: { currentPassword: string; password: string; confirmPassword: string };
  user: IUserWithId;
}

export default IRequestWithChangePassword;
