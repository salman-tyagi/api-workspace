import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import IUser from './interfaces/IUser';

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [30, 'Must be less than 30 characters'],
      minlength: [2, 'Must be greater than 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      trim: true,
      validate: {
        validator: function (val: string): boolean {
          return val.includes('@');
        },
        message: 'Must be a valid email address'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Must be at least 6 characters long'],
      maxlength: [30, 'Must be less than 30 characters'],
      select: false
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirm password is required'],
      validate: {
        validator: function (pass: string): boolean {
          return this.password === pass;
        },
        message: 'Password mismatch'
      }
    },
    verified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    versionKey: false
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined!;

  return next();
});

userSchema.methods.validatePassword = async (
  userPassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(userPassword, hashedPassword);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
