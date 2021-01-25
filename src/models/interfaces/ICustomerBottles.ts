import { Document } from 'mongoose';

export interface ICustomerBottles extends Document {
  bottleQuantity: number;
  salesTripID: string;
  customer: string;
  customerLocation?: string;
  // customerType?: string;
  amount: number;
  issuedAt: Date;
  isPaid: boolean;
  deliveryNoteNumber: string;
  receiptNumber: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
