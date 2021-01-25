import { Model, Schema, model, Types } from 'mongoose';

import { IOrder } from './interfaces/IOrder';

const orderSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'CANCELLED', 'PENDING'],
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    totalAmount: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    transactions: [{ type: Schema.Types.ObjectId }],
    items: [
      {
        orderItemType: {
          type: String,
          enum: ['COUPON', 'INVENTORY'],
          required: true,
        },
        amount: {
          type: Schema.Types.Decimal128,
          required: true,
        },
        offer: {
          type: Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
          required: true,
        },
        inventory: {
          type: Schema.Types.ObjectId,
        },
        remark: {
          type: String,
          minlength: 3,
          maxlength: 255,
        },
      },
    ],
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

orderSchema.methods.toJSON = function toJSON() {
  const order = this.toObject();
  order.id = order._id.toString();
  if (order.client) {
    if (order.client instanceof Types.ObjectId) {
      order.clientId = order.client.toString();
      delete order.client;
    }
  }
  order.totalAmount = order.totalAmount.toString();
  order.transactions = order.transactions.map((transaction: string) => transaction.toString());
  order.items = order.items.map((item: any) => {
    const out: any = {};
    out.amount = item.amount.toString();
    if (item.inventory) {
      out.inventory = item.inventory.toString();
    }
    out.remark = item.remark;
    return out;
  });
  if (order.customer) {
    if (order.customer instanceof Types.ObjectId) {
      order.customerId = order.customer.toString();
      delete order.customer;
    }
  }
  delete order._id;
  delete order.__v;
  delete order.createdBy;
  delete order.updatedBy;
  delete order.createdAt;
  delete order.updatedAt;
  delete order.updatedAt;
  return order;
};

export interface IOrderModel extends Model<IOrder> {}

export default model<IOrder>('Order', orderSchema);
