import { Document } from 'mongoose';

export interface IOrderSeqNo extends Document {
  prefix: string;
  count: number;
}
