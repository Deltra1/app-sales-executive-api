import { Schema, Types, Model, model } from 'mongoose';
import { IRoute } from './interfaces/IRoute';

const routeSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      maxlength: 255,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    currentJourney: {
      type: Schema.Types.ObjectId,
      ref: 'RouteJourney',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);

routeSchema.methods.toJSON = function toJSON() {
  const route = this.toObject();
  route.id = route._id.toString();
  if (route.assignedTo) {
    if (route.assignedTo instanceof Types.ObjectId) {
      route.assignedToId = route.assignedTo._id.toString();
      delete route.assignedTo;
    } else {
      route.assignedTo = this.assignedTo.toJSON();
    }
  }
  if (route.currentLocation) {
    const [longitude, latitude] = route.currentLocation.coordinates;
    route.currentLocation = { latitude, longitude };
  }
  if (route.currentJourney) {
    if (route.currentJourney instanceof Types.ObjectId) {
      route.currentJourneyId = route.currentJourney.toString();
      delete route.currentJourney;
    } else {
      route.currentJourney = this.currentJourney.toJSON();
    }
  }
  if (route.client && route.client instanceof Types.ObjectId) {
    route.clientId = this.client.toString();
    delete route.client;
  }
  delete route._id;
  delete route.__v;
  delete route.createdBy;
  delete route.updatedBy;
  delete route.createdAt;
  delete route.updatedAt;
  return route;
};

export interface IRouteModel extends Model<IRoute> {}

const routeModel = model<IRoute>('Route', routeSchema);

export default routeModel;
