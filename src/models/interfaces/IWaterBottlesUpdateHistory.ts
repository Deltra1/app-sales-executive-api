import { Document } from 'mongoose';

export interface IWaterBottlesUpdateHistory extends Document {
  client: string;
  added?: number;
  removed?: number;
  waterBottles: number;
  updatedDate: Date;
  createdBy: string;
  updatedBy: string;
}
