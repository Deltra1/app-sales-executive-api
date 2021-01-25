import { Document } from 'mongoose';

export interface ICustomerCoupon extends Document {
  couponQuantity: number;
  salesTripID: string;
  customer: string;
  amount: number;
  offer: string;
  issuedAt: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
