import { Document } from 'mongoose';

export interface IInventory extends Document {
  name: string;
  description: string;
  company: string;
  inventoryType: string;
  serialNumber: string;
  price: string;
  isAvailable: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
