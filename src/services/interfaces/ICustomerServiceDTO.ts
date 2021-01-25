import IUser from '../../models/interfaces/IUser';
import { ICustomerInventory } from '../../models/interfaces/ICustomerInventory';
import { IOrder } from '../../models/interfaces/IOrder';
import { ITransaction } from '../../models/interfaces/ITransaction';
import { IPagination } from './common/IPagination';
import ICustomer, { CustomerRouteDeliveryDays } from '../../models/interfaces/ICustomer';

export interface IGetAllCustomersOfSalesExecutiveOutputDTO extends IPagination {
  customers: ICustomer[];
}

export interface ICreateCustomerLocation {
  route: string;
  deliveryDays: CustomerRouteDeliveryDays[];
  municipality: string;
  street: number;
  zone: number;
  buildingNumber: number;
  latitude: number;
  longitude: number;
  landmark?: string;
  flatNumber?: string;
  floorNumber?: string;
}

export interface ICreateCustomerInputDataDTO {
  client: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    municipality: string;
    street: number;
    zone: number;
    buildingNumber: number;
    landmark?: string;
    flatNumber?: string;
    floorNumber?: string;
  };
  customerType: string;
  locations?: ICreateCustomerLocation[];
  createdUser: IUser;
  openingCouponBalance?: number;
}

export interface IUpdateCustomerInputDataDTO {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: {
    municipality?: string;
    street?: number;
    zone?: number;
    buildingNumber?: number;
    landmark?: string;
    flatNumber?: string;
    floorNumber?: string;
  };
  locations?: {
    municipality?: string;
    street?: number;
    zone?: number;
    buildingNumber?: number;
    latitude?: number;
    longitude?: number;
    landmark?: string;
    flatNumber?: string;
    floorNumber?: string;
  }[];
}

export interface IAddCustomerInventoryInputDataDto {
  inventories: {
    isPaid: boolean;
    inventory: string;
    offerCode?: string;
    amount: number;
  }[];
  customerId: string;
}

export interface IAddCustomerInventoryOutputDataDto {
  order?: IOrder;
  customerInventories: ICustomerInventory[];
  transaction?: ITransaction;
}

export interface IAddCustomerCouponInputDataDto {
  coupons: number;
  offerCode?: string;
  customerId: string;
}

export interface IAddCustomerCouponOutputDataDto {
  order: IOrder;
  transaction: ITransaction;
}

export interface IAddCustomerBottlesInputDataDto {
  customerBottleRequest: {
    isPaid: boolean;
    bottleQuantity: number;
    customerId: string;
    customerLocationId?: string;
    deliveryNoteNumber?: string;
    receiptNumber?: string;
    amount: number;
  };
}

export interface IAddCustomerBottlesOutputDataDto {
  order?: IOrder;
  customerInventories: ICustomerInventory[];
  transaction?: ITransaction;
}
