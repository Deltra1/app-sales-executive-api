import { Schema, Types, model, Model } from 'mongoose';

import { IInventory } from './interfaces/IInventory';

const inventorySchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    description: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 255,
    },
    company: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    inventoryType: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    serialNumber: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    price: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    isAvailable: {
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

inventorySchema.methods.toJSON = function toJSON() {
  const inventory = this.toObject();
  inventory.id = inventory._id.toString();
  if (inventory.client) {
    if (inventory.client instanceof Types.ObjectId) {
      inventory.clientId = inventory.client.toString();
      delete inventory.client;
    }
  }
  inventory.price = inventory.price.toString();
  inventory.company = inventory.company.toString();
  inventory.inventoryType = inventory.inventoryType.toString();
  delete inventory._id;
  delete inventory.__v;
  delete inventory.createdBy;
  delete inventory.updatedBy;
  delete inventory.createdAt;
  delete inventory.updatedAt;
  return inventory;
};

export interface IInventoryModel extends Model<IInventory> {}

export default model<IInventory>('Inventory', inventorySchema);
