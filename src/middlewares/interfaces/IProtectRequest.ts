import { Request } from 'express';

import IUser from '../../models/interfaces/IUser';

export default interface IProtectRequest extends Request {
  user?: IUser;
}
