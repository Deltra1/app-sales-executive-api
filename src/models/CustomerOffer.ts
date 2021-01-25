import { Model, Schema, model } from 'mongoose';

import { ICustomerOffer } from './interfaces/ICustomerOffer';

const customerOfferSchema = new Schema(
  {
    offerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Offer',
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Customer',
    },
    isOpened: {
      type: Boolean,
      required: true,
      default: false,
    },
    isUsed: {
      type: Boolean,
      required: true,
      default: false,
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

customerOfferSchema.methods.toJSON = function toJSON(): any {
  const customerOffer = this.toObject();
  customerOffer.id = customerOffer._id.toString();

  delete customerOffer._id;
  delete customerOffer.__v;
  delete customerOffer.createdBy;
  delete customerOffer.updatedBy;
  delete customerOffer.createdAt;
  delete customerOffer.updatedAt;
  return customerOffer;
};
export interface ICustomerOfferModel extends Model<ICustomerOffer> {}

export default model<ICustomerOffer>('CustomerOffer', customerOfferSchema);
