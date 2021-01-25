import { Document, Schema, Model } from 'mongoose';

export interface IUserToken {
  accessToken: string;
  refreshToken: string;
}

export default interface IUser extends Document {
  client: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  role?: string;
  password: string;
  tokens: IUserToken[];
  isActive?: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
