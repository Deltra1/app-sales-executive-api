import { Document } from 'mongoose';

export interface ICustomerOffer extends Document {
  offerId: string;
  customerId: string;
  isOpened: boolean;
  isUsed: boolean;
  createdBy: string;
  updatedBy: string;
}
