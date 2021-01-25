import { Model, Schema, model, Types } from 'mongoose';
import { ICustomerInventory } from './interfaces/ICustomerInventory';
import mongoose from 'mongoose';
import { OfferService } from '../services/OfferService';

const customerInventorySchema = new Schema(
  {
    inventory: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
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
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
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
    isActive: {
      type: Boolean,
      default: true,
    },
    deactivatedAt: {
      type: Date,
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

customerInventorySchema.methods.toJSON = function toJSON() {
  const customerInventory = this.toObject();
  customerInventory.id = customerInventory._id.toString();
  if (customerInventory.inventory instanceof mongoose.Types.ObjectId) {
    customerInventory.inventoryId = customerInventory.inventory.toString();
    delete customerInventory.inventory;
  } else {
    customerInventory.inventory = this.inventory.toJSON();
  }
  if (customerInventory.order) {
    if (customerInventory.order instanceof mongoose.Types.ObjectId) {
      customerInventory.orderId = customerInventory.order.toString();
      delete customerInventory.order;
    } else {
      customerInventory.order = this.order.toJSON();
    }
  }
  if (customerInventory.customer instanceof mongoose.Types.ObjectId) {
    customerInventory.customerId = customerInventory.customer.toString();
    delete customerInventory.customer;
  } else {
    customerInventory.customer = this.customer.toJSON();
  }
  if (customerInventory.salesTripID instanceof Types.ObjectId) {
    customerInventory.salesTripID = customerInventory.salesTripID.toString();
  } else {
    customerInventory.salesTripID = this.salesmanTrip.toJSON();
  }
  delete customerInventory._id;
  delete customerInventory.__v;
  delete customerInventory.createdBy;
  delete customerInventory.updatedBy;
  delete customerInventory.createdAt;
  delete customerInventory.updatedAt;
  return customerInventory;
};

export interface ICustomerInventoryModel extends Model<ICustomerInventory> {}

export default model<ICustomerInventory>('CustomerInventory', customerInventorySchema);
