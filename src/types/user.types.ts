import { Document, Model, Types } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  name: string;
  tokenBalance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserDocument extends IUser, Document, IUserMethods {
  _id: Types.ObjectId;
}

export interface IUserModel extends Model<IUserDocument> {
  // Add any static methods here if needed
} 