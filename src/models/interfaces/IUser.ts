interface IUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  verified: boolean;
  createdAt?: Date;

  validatePassword(userPassword: string, hashedPassword: string): boolean;
}

export default IUser;
