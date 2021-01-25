import { Model, Schema, model } from 'mongoose';
import { IOrderSeqNo } from './interfaces/IOrderSeqNo';

const orderSeqNoSchema = new Schema(
  {
    prefix: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
    },
    count: {
      type: Number,
      required: true,
    },
  },
  {
    autoCreate: true,
    timestamps: true,
  },
);

export interface IOrderSeqNoModel extends Model<IOrderSeqNo> {}

export default model<IOrderSeqNo>('OrderSeqNo', orderSeqNoSchema);
