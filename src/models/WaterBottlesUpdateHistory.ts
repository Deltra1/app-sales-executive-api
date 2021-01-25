import { Model, Schema, model } from 'mongoose';
import { IWaterBottlesUpdateHistory } from './interfaces/IWaterBottlesUpdateHistory';

export const waterBottlesUpdateHistorySchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    added: {
      type: Number,
    },
    removed: {
      type: Number,
    },
    waterBottles: {
      type: Number,
      required: true,
    },
    updatedDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);

export interface IWaterBottlesUpdateHistoryModel extends Model<IWaterBottlesUpdateHistory> {}
export default model<IWaterBottlesUpdateHistory>('WaterBottlesUpdateHistory', waterBottlesUpdateHistorySchema);
