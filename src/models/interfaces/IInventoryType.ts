import { Document } from 'mongoose';

export interface IInventoryType extends Document {
  type: string;
  count:number;
  createdBy: string;
  updatedBy: string;
}
