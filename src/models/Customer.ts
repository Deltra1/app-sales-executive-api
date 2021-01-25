import { Schema, model, Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import ICustomer from './interfaces/ICustomer';
import config from '../config';

const customerSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    customerId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    email: {
      type: String,
      maxlength: 255,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      maxlength: 15,
      minlength: 7,
    },
    address: {
      municipality: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Municipality',
      },
      zone: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      buildingNumber: {
        type: String,
        required: true,
        maxlength: 255,
      },
      flatNumber: {
        type: String,
        maxlength: 255,
      },
      floorNumber: {
        type: String,
        maxlength: 255,
      },
      landmark: {
        type: String,
        maxlength: 255,
      },
    },
    customerType: {
      type: String,
      required: true,
      enum: ['COUPON_CUSTOMER', 'CREDIT_CUSTOMER', 'CASH_CUSTOMER'],
    },
    locations: [
      {
        route: {
          type: Schema.Types.ObjectId,
          ref: 'Route',
        },
        deliveries: {
          days: [
            {
              type: String,
              enum: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
              required: true,
            },
          ],
          waterBottles: {
            type: Number,
            required: true,
          },
        },
        municipality: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Municipality',
        },
        zone: {
          type: String,
          required: true,
        },
        street: {
          type: String,
          required: true,
        },
        buildingNumber: {
          type: String,
          required: true,
          maxlength: 255,
        },
        flatNumber: {
          type: String,
          maxlength: 255,
        },
        location: {
          type: {
            type: String,
            enum: ['Point'],
            required: true,
          },
          coordinates: {
            type: [Number],
            required: true,
          },
        },
        floorNumber: {
          type: String,
          maxlength: 255,
        },
        landmark: {
          type: String,
          maxlength: 255,
        },
        photos: {
          type: [String],
        },
      },
    ],
    coupons: {
      type: Number,
      required: true,
    },
    openingCouponBalance: {
      type: Number,
      default: 0,
    },
    couponDiscount: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    changePassword: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    deactivatedAt: {
      type: Date,
    },
    termsAndConditionsAccepted: {
      type: Boolean,
      default: false,
    },
    termsAndConditions: [
      {
        termsAndConditions: {
          type: Schema.Types.ObjectId,
        },
        acceptedAt: {
          type: Date,
        },
      },
    ],
    signature: {
      type: String,
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
    remarks: {
      type: String,
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

customerSchema.pre<ICustomer>('save', async function save(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

customerSchema.methods.toJSON = function toJSON(): any {
  const customerData = this.toObject();
  customerData.id = customerData._id.toString();
  if (customerData.client) {
    if (customerData.client instanceof Types.ObjectId) {
      customerData.clientId = customerData.client.toString();
      delete customerData.client;
    }
  }
  if (customerData.address.municipality instanceof Types.ObjectId) {
    customerData.address.municipalityId = customerData.address.municipality._id.toString();
    delete customerData.address.municipality._id;
    delete customerData.address.municipality;
  } else {
    customerData.address.municipality = this.address.municipality.toJSON();
  }
  delete customerData._id;
  delete customerData.__v;
  delete customerData.tokens;
  delete customerData.createdBy;
  delete customerData.updatedBy;
  delete customerData.createdAt;
  delete customerData.updatedAt;
  delete customerData.signature;
  delete customerData.termsAndConditions;
  delete customerData.deactivatedAt;
  delete customerData.changePassword;
  delete customerData.password;
  customerData.locations.map((location: any, index: number) => {
    const [longitude, latitude] = location.location.coordinates;
    location.id = location._id.toString();
    if (location.municipality instanceof Types.ObjectId) {
      location.municipalityId = location.municipality.toString();
      delete location.municipality;
    } else {
      location.municipality = this.locations[index].municipality.toJSON();
    }
    if (location.route) {
      if (location.route instanceof Types.ObjectId) {
        location.routeId = location.route.toString();
        delete location.route;
      } else {
        location.route = this.locations[index].route.toJSON();
      }
    }
    if (location.photos) {
      location.photos = location.photos.map((item: any) => `${config.aws.s3BaseUrl + config.aws.routeLocationImagesDir}/${item}`);
    }
    location.coordinates = {
      latitude,
      longitude,
    };
    delete location.location;
    delete location._id;
    return location;
  });
  return customerData;
};

export interface ICustomerModel extends Model<ICustomer> {}

const customerModel = model<ICustomer>('Customer', customerSchema);
export default customerModel;
