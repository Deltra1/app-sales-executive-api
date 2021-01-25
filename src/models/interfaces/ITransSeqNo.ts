import { Document } from 'mongoose';

export interface ITransSeqNo extends Document {
  prefix: string;
  count: number;
}
