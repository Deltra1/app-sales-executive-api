import { Model, Schema, Types, model } from 'mongoose';
import { IInventoryType } from './interfaces/IInventoryType';

const inventoryTypeSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 255,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
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

inventoryTypeSchema.methods.toJSON = function toJSON() {
  const inventoryType = this.toObject();
  inventoryType.id = inventoryType._id.toString();
  if (inventoryType.client) {
    if (inventoryType.client instanceof Types.ObjectId) {
      inventoryType.clientId = inventoryType.client.toString();
      delete inventoryType.client;
    }
  }
  delete inventoryType._id;
  delete inventoryType.__v;
  delete inventoryType.createdBy;
  delete inventoryType.updatedBy;
  delete inventoryType.createdAt;
  delete inventoryType.updatedAt;
  return inventoryType;
};

export interface IInventoryTypeModel extends Model<IInventoryType> {}

export default model<IInventoryType>('InventoryType', inventoryTypeSchema);
