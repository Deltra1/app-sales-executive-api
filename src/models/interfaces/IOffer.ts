import { Document } from 'mongoose';

export interface IOffer extends Document {
  offerCode: string;
  startDate: Date;
  endDate: Date;
  discount: number;
  description: string;
  createdBy: string;
  updatedBy: string;
}
