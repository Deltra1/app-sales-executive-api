import { Model, Schema, Types, model } from 'mongoose';

import { ITransaction } from './interfaces/ITransaction';

const transactinoSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    transId: {
      type: String,
      unique: true,
      required: true,
    },
    transType: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
    },
    transDate: {
      type: Date,
      default: Date.now,
    },
    transAmount: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    remark: {
      type: String,
      minlength: 3,
      maxlength: 255,
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
    autoCreate: true,
    timestamps: true,
  },
);

transactinoSchema.methods.toJSON = function toJSON() {
  const transaction = this.toObject();
  transaction.id = transaction._id.toString();
  if (transaction.client) {
    if (transaction.client instanceof Types.ObjectId) {
      transaction.clientId = transaction.client.toString();
      delete transaction.client;
    }
  }
  transaction.transAmount = transaction.transAmount.toString();
  delete transaction._id;
  delete transaction.__v;
  delete transaction.createdBy;
  delete transaction.updatedBy;
  delete transaction.createdAt;
  delete transaction.updatedAt;
  return transaction;
};

export interface ITransactionModel extends Model<ITransaction> {}

export default model('Transaction', transactinoSchema);
