import { Schema, model, Model, mongo } from 'mongoose';

import IUser from './interfaces/IUser';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Client',
    },
    userId: {
      type: String,
      unique: true,
      require: true,
    },
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 70,
    },
    email: {
      required: true,
      type: String,
      maxLength: 255,
    },
    phoneNumber: {
      required: true,
      type: String,
      maxLength: 15,
    },
    passportNumber: {
      type: String,
      minLength: 5,
      maxLength: 255,
    },
    dob: {
      required: true,
      type: Date,
    },
    address: {
      required: true,
      type: String,
      minLength: 5,
      maxLength: 255,
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'SALESMAN', 'SALES_EXECUTIVE'],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        accessToken: {
          type: String,
          require: true,
        },
        refreshToken: {
          type: String,
          require: true,
        },
      },
    ],
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
  },
);

/**
 * find User By UserId and password
 * @throws Exception
 * @return {User|null} If username or password is error return null
 */
userSchema.statics.findUserByUserIdAndPassword = async function findUserByUserIdAndPassword(userId: string, password: string) {
  const user = await this.findOne({ userId }).populate('client');
  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return null;
  }
  return user;
};

userSchema.pre<IUser>('save', async function save(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  if (this.isModified('tokens')) {
    this.tokens = this.tokens.slice(-5);
  }
  next();
});

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  user.id = user._id.toString();
  if (user.roleId) {
    user.roleId = user.roleId.toString();
  }

  if (user.client instanceof mongoose.Types.ObjectId) {
    user.clientId = user.client.toString();
    delete user.client;
  } else {
    user.client = this.client.toJSON();
    user.clientId = user.client.id.toString();
    user.clientLogo = `${process.env.SALES_EXECUTIVE_APP_CLIENT_LOGO_URL + user.client.logo}`;
    user.clientBottlePrice = Number(user.client.bottlePrice);
    user.clientCouponPrice = Number(user.client.couponPrice);
  }
  delete user.client;

  delete user._id;
  delete user.__v;
  delete user.password;
  delete user.tokens;
  delete user.createdBy;
  delete user.updatedBy;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.roleId; // it is for temporary
  return user;
};

export interface IUserModel extends Model<IUser> {
  findUserByUserIdAndPassword(userId: string, password: string): Promise<IUser>;
}

const userModel = model<IUser>('User', userSchema);
export default userModel;
