import { Schema, Types, Model, model } from 'mongoose';
import ISalesManTrip from './interfaces/ISalesManTrip';
const salesmanTripSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Client',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    bottleStock: {
      type: Number,
      default: 0,
    },
    remainigBottleStock: {
      type: Number,
      default: 0,
    },
    totalBottlesSoldAmount: {
      type: Number,
      default: 0,
    },
    totalInventorySoldAmount: {
      type: Number,
      default: 0,
    },
    inventoryStock: [
      {
        inventoryType: {
          type: Schema.Types.ObjectId,
          ref: 'InventoryType',
        },
        isPaid: {
          type: Boolean,
        },
        quantity: Number,
        remainingStock: Number,
      },
    ],
    scheduleDate: {
      type: Date,
      required: true,
    },
    journeyStatus: {
      type: String,
      required: true,
      enum: ['STARTED', 'PENDING', 'COMPLETED'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);

salesmanTripSchema.methods.toJSON = function toJSON(): any {
  const salesmanTrip = this.toObject();
  salesmanTrip.Id = salesmanTrip._id.toString();
  salesmanTrip.bottleQuantity = salesmanTrip.salesmanTrip;
  salesmanTrip.customer = salesmanTrip.customer;

  delete salesmanTrip.issuedAt;
  delete salesmanTrip.isPaid;
  delete salesmanTrip.createdBy;
  delete salesmanTrip.createdAt;
  delete salesmanTrip.updatedAt;
  delete salesmanTrip._v;
  return salesmanTrip;
};

export interface ISalesManTripModel extends Model<ISalesManTrip> {}

const salesmanTripModel = model<ISalesManTrip>('SalesmanTrip', salesmanTripSchema);
export default salesmanTripModel;
