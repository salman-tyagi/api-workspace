import IUser from '../../models/interfaces/IUser';

interface IResponse {
  status: string;
  result?: number;
  data?: IUser | IUser[];
  message?: string;
  token?: string;
}

export default IResponse;
