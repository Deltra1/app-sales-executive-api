import { Document } from 'mongoose';

export default interface ICounter extends Document {
  seq: number;
}
