import { Document } from 'mongoose';

export interface ICustomerInventory extends Document {
  inventory: string;
  customer: string;
  salesTripID:string;
  order?: string;
  issuedAt: Date;
  isPaid: boolean;
  amount:number;
  deactivatedAt?: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
