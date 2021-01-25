import { Document } from 'mongoose';

export enum TransType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export interface ITransaction extends Document {
  transId: string;
  transType: TransType;
  transDate: Date;
  transAmount: number;
  remark: string;
  createdBy: string;
  updatedBy: string;
}
