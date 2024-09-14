interface IUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  createdAt?: Date;
}

export default IUser;
