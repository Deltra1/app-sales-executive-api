import { Document } from 'mongoose';

export enum JourneyStatus {
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
}

export interface IinventoryStock {
  inventoryType: string;
  isPaid: boolean;
  quantity: number;
  remainingStock: number;
}

export default interface ISalesManTrip extends Document {
  client: string;
  name: string;
  assignedTo: string;
  email?: string;
  scheduleDate: Date;
  bottleStock: number;
  remainigBottleStock: number;
  totalBottlesSoldAmount:number;
  inventoryStock: IinventoryStock[];
  journeyStatus: JourneyStatus;
  createdBy: string;
  updatedBy: string;
}
