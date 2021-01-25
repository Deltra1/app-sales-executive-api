import { Document } from 'mongoose';

export default interface IClient extends Document {
  name: string;
  companyAddress: string;
  phoneNumber: string;
  email: string;
  companyName: string;
  companyUserPrefix: string;
  companyCustomerPrefix: string;
  orderPrefix: string;
  transactionPrefix: string;
  couponPrice: number;
  waterBottles: number;
  isActive?: boolean;
  createdBy: string;
  updatedBy: string;
}
