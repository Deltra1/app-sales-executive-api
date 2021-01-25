import { Document } from 'mongoose';

export interface IRouteCurrentLocation {
  type: string;
  coordinates: number[];
}

export interface IRoute extends Document {
  client: string;
  name: string;
  vehicleNumber: string;
  assignedTo: string;
  currentLocation: IRouteCurrentLocation;
  currentJourney: string;
  createdBy: string;
  updatedBy: string;
}
