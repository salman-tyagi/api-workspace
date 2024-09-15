type Role = 'admin' | 'user';

interface IUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  verified: boolean;
  active: boolean;
  role: Role;
  passwordResetToken: string;
  passwordResetTokenExpiresAt: Date;
  passwordChangedAt: Date,
  createdAt?: Date;
  validatePassword(userPassword: string, hashedPassword: string): boolean;
}

export default IUser;
