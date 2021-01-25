export interface ICreateCustomerResponseData {
  customerId: string;
  email?: string;
  phoneNumber: string;
  isActive: boolean;
  address: {
    municipality: string;
    zone: number;
    street: number;
    buildingNumber: number;
    flatNumber?: string;
    floorNumber?: string;
    landMark?: string;
  };
  locations: [
    {
      id: string;
      municipality: string;
      street: number;
      zone: number;
      buildingNumber: number;
      coordinates: string;
      landmark?: string;
      flatNumber?: string;
      floorNumber?: string;
    },
  ];
  coupons: number;
}

export interface IGetAllSalesExecutiveCustomersResponseData {
  customerId: string;
  email?: string;
  phoneNumber: string;
  isActive: boolean;
  address: {
    municipalityId: string;
    zone: number;
    street: number;
    buildingNumber: number;
    flatNumber?: string;
    floorNumber?: string;
    landMark?: string;
  };
  locations: [
    {
      id: string;
      municipalityId: string;
      street: number;
      zone: number;
      buildingNumber: number;
      coordinates: string;
      landmark?: string;
      flatNumber?: string;
      floorNumber?: string;
    },
  ];
  coupons: number;
}
