import { Document } from 'mongoose';

export interface IMunicipality extends Document {
  name: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}
