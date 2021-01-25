import { Schema, Types, Model, model } from 'mongoose';
import IClient from './interfaces/IClient';

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
      unique: true,
    },
    companyAddress: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 255,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyUserPrefix: {
      type: String,
      unique: true,
      required: true,
    },
    companyCustomerPrefix: {
      type: String,
      unique: true,
      required: true,
    },
    orderPrefix: {
      type: String,
      unique: true,
      required: true,
    },
    transactionPrefix: {
      type: String,
      unique: true,
      required: true,
    },
    acceptCustomerRequestEndTime: {
      required: true,
      type: String,
    },
    couponPrice: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    waterBottles: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

clientSchema.methods.toJSON = function toJSON() {
  const client = this.toObject();
  client.id = client._id.toString();
  client.couponPrice = (client.couponPrice && client.couponPrice.toString()) || null;
  delete client._id;
  delete client.__v;
  delete client.createdBy;
  delete client.updatedBy;
  delete client.createdAt;
  delete client.updatedAt;

  return client;
};

export interface IClientModel extends Model<IClient> {}

const clientModel = model<IClient>('Client', clientSchema);
export default clientModel;
