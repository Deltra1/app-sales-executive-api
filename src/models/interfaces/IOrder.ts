import { Document } from 'mongoose';

export enum OrderStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

export enum OrderItemType {
  COUPON = 'COUPON',
  INVENTORY = 'INVENTORY',
}

export interface IOrder extends Document {
  orderId: string;
  status: OrderStatus;
  orderDate: Date;
  totalAmount: number;
  customer: string;
  transactions: string[];
  items: {
    orderItemType: OrderItemType;
    amount: number;
    offer: number;
    quantity: number;
    inventory?: string;
    remark?: string;
  }[];
  createdBy: string;
  updatedBy: string;
}
