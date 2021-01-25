import { Model, Schema, model, Types } from 'mongoose';
import { ICustomerCoupon } from './interfaces/ICustomerCoupon';

const customerCouponSchema = new Schema(
  {
    couponQuantity: {
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

    amount: {
      type: Number,
      default: 0,
      required: true,
    },
    offer: {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
    },

    issuedAt: {
      type: Date,
      default: Date.now,
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

customerCouponSchema.methods.toJSON = function toJSON(): any {
  const customerCoupon = this.toObject();
  customerCoupon.Id = customerCoupon._id.toString();

  if (customerCoupon.salesTripID instanceof Types.ObjectId) {
    customerCoupon.salesTripID = customerCoupon.salesTripID.toString();
  } else {
    customerCoupon.salesTripID = this.salesmanTrip.toJSON();
  }
  delete customerCoupon._id;
  delete customerCoupon.createdBy;
  delete customerCoupon.createdAt;
  delete customerCoupon.updatedAt;
  delete customerCoupon.__v;
  return customerCoupon;
};
export interface ICustomerCouponModel extends Model<ICustomerCoupon> {}

export default model<ICustomerCoupon>('CustomerCoupon', customerCouponSchema);
