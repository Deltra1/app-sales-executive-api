import { Model, Schema, model } from 'mongoose';
import { ITransSeqNo } from './interfaces/ITransSeqNo';

const transSeqNoSchema = new Schema(
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

export interface ITransSeqNoModel extends Model<ITransSeqNo> {}

export default model<ITransSeqNo>('TransSeqNo', transSeqNoSchema);
