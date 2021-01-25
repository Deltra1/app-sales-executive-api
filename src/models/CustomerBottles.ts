import { Model, Schema, model, Types } from 'mongoose';
import { ICustomerBottles } from './interfaces/ICustomerBottles';

const customerBottlesSchema = new Schema(
  {
    bottleQuantity: {
      type: Number,
      required: true,
    },
    salesTripID: {
      type: Schema.Types.ObjectId,
      ref: 'SalesmanTrip',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerLocation: {
      type: Schema.Types.ObjectId,
    },
    // cusotomerType: {
    //   type: String,
    //   enum: ['COUPON_CUSTOMER', 'CREDIT_CUSTOMER', 'CASH_CUSTOMER'],
    // },
    amount: {
      type: Number,
      default: 0,
      required: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
    deliveryNoteNumber: {
      type: String,
    },
    receiptNumber: {
      type: String,
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

customerBottlesSchema.methods.toJSON = function toJSON(): any {
  const customerBottles = this.toObject();
  customerBottles.Id = customerBottles._id.toString();
  delete customerBottles.customerLocation;
  delete customerBottles._id;
  if (customerBottles.salesTripID instanceof Types.ObjectId) {
    customerBottles.salesTripID = customerBottles.salesTripID.toString();
  } else {
    customerBottles.salesTripID = this.salesmanTrip.toJSON();
  }
  delete customerBottles.customer;
  delete customerBottles.createdBy;
  delete customerBottles.createdAt;
  delete customerBottles.updatedAt;
  delete customerBottles.__v;
  return customerBottles;
};
export interface ICustomerBottlesModel extends Model<ICustomerBottles> {}

export default model<ICustomerBottles>('CustomerBottles', customerBottlesSchema);
