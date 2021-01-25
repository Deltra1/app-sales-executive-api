import { CustomerRouteDeliveryDays, CustomerType, IDelivery } from '../../../models/interfaces/ICustomer';

interface ICreateCustomerLocation {
  routeId: string;
  deliveries: IDelivery[];
  municipalityId: string;
  street: number;
  zone: number;
  buildingNumber: number;
  coordinates: string;
  landmark?: string;
  flatNumber?: string;
  floorNumber?: string;
}

export interface ICreateCustomerRequestData {
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    municipalityId: string;
    street: number;
    zone: number;
    buildingNumber: number;
    landmark?: string;
    flatNumber?: string;
    floorNumber?: string;
  };
  customerType: CustomerType;
  locations?: ICreateCustomerLocation[];
}

export interface IUpdateSalesExecutiveCustomerRequestData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: {
    municipalityId?: string;
    street?: number;
    zone?: number;
    buildingNumber?: number;
    landmark?: string;
    flatNumber?: string;
    floorNumber?: string;
  };
  locations?: {
    id?: string;
    muicipalityId?: string;
    street?: number;
    zone?: number;
    buildingNumber?: number;
    landmark?: string;
    flatNumber?: string;
    floorNumber?: string;
    coordinates?: string;
  }[];
}

export interface IAddCustomerInventoryRequestData {
  inventories: {
    inventoryId: string;
    isPaid: boolean;
    offerCode?: string;
    amount:number;
  }[];
}

export interface IAddCustomerBottlesRequestData {
  isPaid: boolean;
  bottleQuantity: number;
  customerId: string;
  customerLocationId?: string;
}

export interface IAddCustomerCouponsRequestData {
  coupons: number;
  offerCode?: string;
}
