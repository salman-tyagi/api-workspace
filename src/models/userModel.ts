import mongoose from 'mongoose';

import IUser from './interfaces/IUser';

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name must required'],
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
      maxlength: [30, 'Must be less than 30 characters']
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
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    versionKey: false
  }
);

const User = mongoose.model('User', userSchema);

export default User;
