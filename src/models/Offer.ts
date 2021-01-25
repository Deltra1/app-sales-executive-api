import { Model, Schema, model } from 'mongoose';

import { IOffer } from './interfaces/IOffer';

const offerSchema = new Schema(
  {
    offerCode: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
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

offerSchema.methods.toJSON = function toJSON(): any {
  const offer = this.toObject();
  offer.id = offer._id.toString();
  offer.offerCode = offer.offerCode;
  offer.discount = offer.discount;

  delete offer.client;
  delete offer._id;
  delete offer.__v;
  delete offer.createdBy;
  delete offer.updatedBy;
  delete offer.createdAt;
  return offer;
};
export interface IOfferModel extends Model<IOffer> {}

export default model<IOffer>('Offer', offerSchema);
