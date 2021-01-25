import { Schema, model, Model } from 'mongoose';
import ICounter from './interfaces/ICounter';

const counterSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);

export interface ICounterModel extends Model<ICounter> {}

const counter = model<ICounter>('Counter', counterSchema);
export default counter;
