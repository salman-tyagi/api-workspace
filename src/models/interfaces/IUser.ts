interface IUser {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  createdAt?: Date;
}

export default IUser;
