import { Document } from 'mongoose';

export interface ICustomerToken {
  accessToken: string;
  refreshToken: string;
}

export enum CustomerType {
  COUPON_CUSTOMER = 'COUPON_CUSTOMER',
  CREDIT_CUSTOMER = 'CREDIT_CUSTOMER',
  CASH_CUSTOMER = 'CASH_CUSTOMER',
}

export enum CustomerRouteDeliveryDays {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface IDelivery {
  days: [CustomerRouteDeliveryDays];
  waterBottles: number;
}

export interface ICustomerLocation {
  municipality: string;
  deliveries: IDelivery;
  zone: number;
  street: number;
  buildingNumber: number;
  flatNumber?: string;
  floorNumber?: string;
  landmark?: string;
  location: {
    type: string;
    coordinates: number[];
  };
  photos: string[];
}

export default interface ICustomer extends Document {
  client: string;
  name: string;
  customerId: string;
  email?: string;
  phoneNumber: string;
  address: {
    route?: string;
    municipality: string;
    zone: number;
    street: number;
    buildingNumber: number;
    flatNumber?: string;
    floorNumber?: string;
    landmark?: string;
  };
  locations: ICustomerLocation[];
  customerType: CustomerType;
  coupons: number;
  couponDiscount?: number;
  openingCouponBalance?: number;
  password: string;
  changePassword: boolean;
  isActive: boolean;
  deactivatedAt: Date;
  termsAndConditions: [
    {
      termsAndConditionsId: string;
      acceptedAt: Date;
    },
  ];
  signature?: string;
  tokens: ICustomerToken[];
  remarks?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
