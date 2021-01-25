import { body, param } from 'express-validator';
import { Container } from 'typedi';
import * as _ from 'lodash';
import { Types } from 'mongoose';

import CustomerService from '../../services/CustomerService';
import { runValidationRules } from './runValidationRules';
import LocationService from '../../services/LocationService';
import { InventoryService } from '../../services/InventoryService';
import { OfferService } from '../../services/OfferService';
import { IInventory } from '../../models/interfaces/IInventory';

export const createCustomerValidator = [
  body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be atlest 3 charachers')
    .isLength({ max: 70 })
    .withMessage('Name must be less than or equal to 70 characters')
    .matches(/^[\w.\s]+$/)
    .withMessage('Name contains invalid characters'),

  body('email')
    .if(body('email').exists())
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is invalid')
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters')
    .bail()
    .custom(async (value: string) => {
      const customerService = Container.get<CustomerService>(CustomerService);
      const customer = await customerService.getCustomerByEmail(value);
      if (customer) {
        throw new Error('Email already exists');
      }
      Promise.resolve();
    }),

  body('phoneNumber')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Phone Number is required')
    .isLength({ min: 7 })
    .withMessage('Phone Number must be greater than or equal to 7 digits')
    .isLength({ max: 15 })
    .withMessage('Phone Number must be less than or equal to 15 digits')
    .matches(/^[\d]+$/)
    .withMessage('Phone Number contains invalid characters')
    .bail()
    .custom(async (value: number) => {
      const customerService = Container.get<CustomerService>(CustomerService);
      const customer = await customerService.getCustomerByPhoneNumber(value);
      if (customer) {
        throw new Error('Phone Number already exists');
      }
      Promise.resolve();
    }),

  body('address.municipalityId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Municipality is required')
    .bail()
    .custom((value: string) => {
      const result = Types.ObjectId.isValid(value);
      if (!result) {
        throw new Error('Invalid Muncipality');
      }
      return true;
    })
    .bail()
    .custom(async (value: string) => {
      const locationService = Container.get<LocationService>(LocationService);
      const municipality = await locationService.getMunicipalityById(value);
      if (!municipality) {
        throw new Error('Invalid Municipality');
      }
      Promise.resolve();
    }),

  body('address.street').trim().not().isEmpty().withMessage('Street name is required'),
  // .isInt()
  // .withMessage('Street should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Street should be greater than or equal to 1')
  // .isInt({ max: 2001 })
  // .withMessage('Street should be less than or equal to 2000'),

  body('address.zone').trim().not().isEmpty().withMessage('Zone name is required'),
  // .isInt()
  // .withMessage('Zone should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Zone should be greater than or equal to 1')
  // .isInt({ max: 2001 })
  // .withMessage('Zone should be less than or equal to 2000'),

  body('address.buildingNumber').trim().not().isEmpty().withMessage('Building number is required'),
  // .trim()
  // .isInt()
  // .withMessage('Building number should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Building number should be greater than or equal to 1')
  // .isInt({ max: 10001 })
  // .withMessage('Building number should be less than or equal to 10000'),

  body('address.landmark')
    .if(body('address.landmark').exists())
    .trim()
    .not()
    .isEmpty()
    .withMessage('Landmark is required')
    .isLength({ max: 255 })
    .withMessage('Landmark must be less than or equal to 255 characters')
    .matches(/^[\w\d\s-\.]*$/)
    .withMessage('Landmark contains invalid characters'),

  body('address.flatNumber').if(body('address.flatNumber').exists()).trim().not().isEmpty().withMessage('Flat number is required'),
  // .isLength({ max: 255 })
  // .withMessage('Flat number must be less than or equal to 255 characters')
  // .matches(/^[\w\d\-\.]*$/)
  // .withMessage('Flat number contains invalid characters'),

  body('address.floorNumber').if(body('address.floorNumber').exists()).trim().not().isEmpty().withMessage('Floor number is required'),
  // .isLength({ max: 255 })
  // .withMessage('Floor number must be less than or equal to 255 characters')
  // .matches(/^[\w\d\-\.]*$/)
  // .withMessage('Floor number contains invalid characters'),

  body('customerType')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Customer Type is required')
    .isIn(['COUPON_CUSTOMER', 'CREDIT_CUSTOMER', 'CASH_CUSTOMER'])
    .withMessage('Invalid customer type'),

  body('locations.*.routeId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Route is required')
    .isMongoId()
    .withMessage('Invalid Route')
    .bail()
    .custom(async (value: string, { req }) => {
      const locationService = Container.get<LocationService>(LocationService);
      const route = await locationService.getRouteById(value, req.user);
      Promise.resolve();
    }),

  body('locations.*.deliveries.days.*')
    .isIn(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'])
    .withMessage('Invalid day'),
  body('locations.*.deliveries.waterBottles').notEmpty().withMessage('Water bottles are required').isInt().withMessage('Invalid water bottles'),

  body('locations.*.municipalityId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Municipality is required')
    .isMongoId()
    .withMessage('Invalid Municipality')
    .bail()
    .custom(async (value: string) => {
      const locationService = Container.get<LocationService>(LocationService);
      const municipality = await locationService.getMunicipalityById(value);
      if (!municipality) {
        throw new Error('Invalid Municipality');
      }
      Promise.resolve();
    }),

  body('locations.*.street').trim().not().isEmpty().withMessage('Street name is required'),
  // .isInt()
  // .withMessage('Street should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Street should be greater than or equal to 1')
  // .isInt({ max: 2001 })
  // .withMessage('Street should be less than or equal to 2000'),

  body('locations.*.zone').trim().not().isEmpty().withMessage('Zone name is required'),
  // .isInt()
  // .withMessage('Zone should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Zone should be greater than or equal to 1')
  // .isInt({ max: 2001 })
  // .withMessage('Zone should be less than or equal to 2000'),

  body('locations.*.flatNumber').if(body('locations.*.flatNumber').exists()).trim().not().isEmpty().withMessage('Flat number is required'),
  // .isLength({ max: 255 })
  // .withMessage('Flat number must be less than or equal to 255 characters')
  // .matches(/^[\w\d\-\.]*$/)
  // .withMessage('Flat number contains invalid characters'),

  body('locations.*.floorNumber').if(body('locations.*.floorNumber').exists()).trim().not().isEmpty().withMessage('Floor number is required'),
  // .isLength({ max: 255 })
  // .withMessage('Floor number must be less than or equal to 255 characters')
  // .matches(/^[\w\d\-\.]*$/)
  // .withMessage('Floor number contains invalid characters'),

  body('locations.*.landmark')
    .if(body('locations.*.landmark').exists())
    .trim()
    .not()
    .isEmpty()
    .withMessage('Landmark is required')
    .isLength({ max: 255 })
    .withMessage('Floor number must be less than or equal to 255 characters')
    .matches(/^[\w\d\s-\.]*$/)
    .withMessage('Floor number contains invalid characters'),

  body('locations.*.buildingNumber').trim().not().isEmpty().withMessage('Building number is required'),
  // .isInt()
  // .withMessage('Building number should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Building number should be greater than or equal to 1')
  // .isInt({ max: 10001 })
  // .withMessage('Building number should be less than or equal to 10000'),

  body('locations.*.coordinates').trim().not().isEmpty().withMessage('Coordinate is required').isLatLong().withMessage('Invalid Coordinates'),

  runValidationRules,
];

export const updateCustomerValidator = [
  body('name')
    .if(body('name').exists())
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be atlest 3 charachers')
    .isLength({ max: 70 })
    .withMessage('Name must be less than or equal to 70 characters')
    .matches(/^[\w.]+$/)
    .withMessage('Name contains invalid characters'),

  body('email')
    .if(body('email').exists())
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is invalid')
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters')
    .bail()
    .custom(async (value: string) => {
      const customerService = Container.get<CustomerService>(CustomerService);
      const customer = await customerService.getCustomerByEmail(value);
      if (customer) {
        throw new Error('Email already exists');
      }
      Promise.resolve();
    }),

  body('phoneNumber')
    .if(body('phoneNumber').exists())
    .trim()
    .not()
    .isEmpty()
    .withMessage('Phone Number is required')
    .isLength({ min: 7 })
    .withMessage('Phone Number must be greater than or equal to 7 digits')
    .isLength({ max: 15 })
    .withMessage('Phone Number must be less than or equal to 15 digits')
    .matches(/^[\d]+$/)
    .withMessage('Phone Number contains invalid characters')
    .bail()
    .custom(async (value: number) => {
      const customerService = Container.get<CustomerService>(CustomerService);
      const customer = await customerService.getCustomerByPhoneNumber(value);
      if (customer) {
        throw new Error('Phone Number already exists');
      }
      Promise.resolve();
    }),

  body('address.municipalityId')
    .if(body('address.municipalityId').exists())
    .trim()
    .not()
    .isEmpty()
    .withMessage('Municipality is required')
    .bail()
    .custom((value: string) => {
      const result = Types.ObjectId.isValid(value);
      if (!result) {
        throw new Error('Invalid Muncipality');
      }
      return true;
    })
    .bail()
    .custom(async (value: string) => {
      const locationService = Container.get<LocationService>(LocationService);
      const municipality = await locationService.getMunicipalityById(value);
      if (!municipality) {
        throw new Error('Invalid Municipality');
      }
      Promise.resolve();
    }),

  body('address.street').if(body('address.street').exists()).trim().not().isEmpty().withMessage('Street name is required'),
  // .isInt()
  // .withMessage('Street should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Street should be greater than or equal to 1')
  // .isInt({ max: 2001 })
  // .withMessage('Street should be less than or equal to 2000'),

  body('address.zone').if(body('address.zone').exists()).trim().not().isEmpty().withMessage('Zone name is required'),
  // .isInt()
  // .withMessage('Zone should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Zone should be greater than or equal to 1')
  // .isInt({ max: 2001 })
  // .withMessage('Zone should be less than or equal to 2000'),

  body('address.buildingNumber').if(body('address.buildingNumber').exists()).trim().not().isEmpty().withMessage('Building number is required'),
  // .trim()
  // .isInt()
  // .withMessage('Building number should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Building number should be greater than or equal to 1')
  // .isInt({ max: 10001 })
  // .withMessage('Building number should be less than or equal to 10000'),

  body('address.landmark').if(body('address.landmark').exists()).trim().not().isEmpty().withMessage('Landmark is required'),
  // .isLength({ max: 255 })
  // .withMessage('Landmark must be less than or equal to 255 characters')
  // .matches(/^[\w\d\-\.]*$/)
  // .withMessage('Landmark contains invalid characters'),

  body('address.flatNumber').if(body('address.flatNumber').exists()).trim().not().isEmpty().withMessage('Flat number is required'),
  // .isLength({ max: 255 })
  // .withMessage('Flat number must be less than or equal to 255 characters')
  // .matches(/^[\w\d\-\.]*$/)
  // .withMessage('Flat number contains invalid characters'),

  body('address.floorNumber').if(body('address.floorNumber').exists()).trim().not().isEmpty().withMessage('Floor number is required'),
  // .isLength({ max: 255 })
  // .withMessage('Floor number must be less than or equal to 255 characters')
  // .matches(/^[\w\d\-\.]*$/)
  // .withMessage('Floor number contains invalid characters'),

  body('locations.*.id')
    .if(body('locations.*.id').exists())
    .trim()
    .not()
    .isEmpty()
    .withMessage('Location is required')
    .bail()
    .custom((value: string) => {
      const result = Types.ObjectId.isValid(value);
      if (!result) {
        throw new Error('Invalid Location');
      }
      return true;
    })
    .bail()
    .custom(async (value: string, { req }: { req: any }) => {
      const id = req.params.id;
      const customerService = Container.get<CustomerService>(CustomerService);
      const customer = await customerService.getSalesExecutiveCustomerById(id, req.user._id);
      const index = customer.locations.findIndex((location: any) => {
        return location._id.equals(value);
      });
      if (index < 0) {
        throw new Error('Invalid location');
      }
      Promise.resolve();
    }),

  body('locations.*.municipalityId')
    .if((value: string, { req, path }: { req: any; path: string }) => {
      const index: number = parseInt(_.toPath(path)[1], 10);
      if ((req.body.locations[index].id && req.body.locations[index].municipalityId) || !req.body.locations[index].id) {
        return true;
      }
      return false;
    })
    .trim()
    .not()
    .isEmpty()
    .withMessage('Municipality is required')
    .isMongoId()
    .withMessage('Invalid Municipality')
    .bail()
    .custom(async (value: string) => {
      const locationService = Container.get<LocationService>(LocationService);
      const municipality = await locationService.getMunicipalityById(value);
      if (!municipality) {
        throw new Error('Invalid Municipality');
      }
      Promise.resolve();
    }),

  body('locations.*.street')
    .if((value: string, { req, path }: { req: any; path: string }) => {
      const index: number = parseInt(_.toPath(path)[1], 10);
      if ((req.body.locations[index].id && req.body.locations[index].street) || !req.body.locations[index].id) {
        return true;
      }
      return false;
    })
    .trim()
    .not()
    .isEmpty()
    .withMessage('Street name is required'),
  // .isInt()
  // .withMessage('Street should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Street should be greater than or equal to 1')
  // .isInt({ max: 2001 })
  // .withMessage('Street should be less than or equal to 2000'),

  body('locations.*.zone')
    .if((value: string, { req, path }: { req: any; path: string }) => {
      const index: number = parseInt(_.toPath(path)[1], 10);
      if ((req.body.locations[index].id && req.body.locations[index].zone) || !req.body.locations[index].id) {
        return true;
      }
      return false;
    })
    .trim()
    .not()
    .isEmpty()
    .withMessage('Zone name is required')
    .isInt()
    .withMessage('Zone should be a number'),
  // .isInt({ min: 1 })
  // .withMessage('Zone should be greater than or equal to 1')
  // .isInt({ max: 2001 })
  // .withMessage('Zone should be less than or equal to 2000'),

  body('locations.*.flatNumber').if(body('locations.*.flatNumber').exists()).trim().not().isEmpty().withMessage('Flat number is required'),
  // .isLength({ max: 255 })
  // .withMessage('Flat number must be less than or equal to 255 characters')
  // .matches(/^[\w\d\-\.]*$/)
  // .withMessage('Flat number contains invalid characters'),

  body('locations.*.floorNumber').if(body('locations.*.floorNumber').exists()).trim().not().isEmpty().withMessage('Floor number is required'),
  // .isLength({ max: 255 })
  // .withMessage('Floor number must be less than or equal to 255 characters')
  // .matches(/^[\w\d\-\.]*$/)
  // .withMessage('Floor number contains invalid characters'),

  body('locations.*.landmark')
    .if(body('locations.*.landmark').exists())
    .trim()
    .not()
    .isEmpty()
    .withMessage('Landmark is required')
    .isLength({ max: 255 })
    .withMessage('Landmark must be less than or equal to 255 characters')
    .matches(/^[\w\d\-\.]*$/)
    .withMessage('Landmark contains invalid characters'),

  body('locations.*.buildingNumber')
    .if((value: string, { req, path }: { req: any; path: string }) => {
      const index: number = parseInt(_.toPath(path)[1], 10);
      if ((req.body.locations[index].id && req.body.locations[index].buildingNumber) || !req.body.locations[index].id) {
        return true;
      }
      return false;
    })
    .trim()
    .not()
    .isEmpty()
    .withMessage('Building number is required'),
  // .isInt()
  // .withMessage('Building number should be a number')
  // .isInt({ min: 1 })
  // .withMessage('Building number should be greater than or equal to 1')
  // .isInt({ max: 10001 })
  // .withMessage('Building number should be less than or equal to 10000'),

  body('locations.*.coordinates')
    .if((value: string, { req, path }: { req: any; path: string }) => {
      const index: number = parseInt(_.toPath(path)[1], 10);
      if ((req.body.locations[index].id && req.body.locations[index].coordinates) || !req.body.locations[index].id) {
        return true;
      }
      return false;
    })
    .trim()
    .not()
    .isEmpty()
    .withMessage('Coordinate is required')
    .isLatLong()
    .withMessage('Invalid Coordinates'),

  runValidationRules,
];

export const addCustomerInventoriesValidator = [
  body('inventories.*.inventoryId')
    .notEmpty()
    .withMessage('Inventory is required')
    .isMongoId()
    .withMessage('Invalid inventoryId')
    .bail()
    .custom(async (value: string) => {
      const inventoryService = Container.get<InventoryService>(InventoryService);
      const inventory: IInventory = await inventoryService.getInventoryById(value);
      // if (!inventory.isAvailable) {
      //   throw new Error('Invalid inventory');
      // }
      return Promise.resolve();
    }),

  body('inventories.*.isPaid').notEmpty().withMessage('Is Paid is required').isBoolean().withMessage('Invalid is Paid'),

  body('inventories.*.offerCode')
    .if(body('inventories.*.offerCode').exists())
    .notEmpty()
    .withMessage('Offer code is empty')
    .bail()
    .custom(async (value: string) => {
      const offerService = Container.get<OfferService>(OfferService);
      const valid = await offerService.isValidOffer(value);
      if (!valid) {
        throw new Error('Invalid offer');
      }
      return Promise.resolve();
    }),

  param('id')
    .notEmpty()
    .withMessage('Customer is required')
    .isMongoId()
    .withMessage('Invalid customer')
    .bail()
    .custom(async (value, { req }) => {
      const customerService = Container.get<CustomerService>(CustomerService);
      const valid = await customerService.isValidSalesExecutiveCustomer(value, req.user._id);
      if (!valid) {
        throw new Error('Invalid customer');
      }
      return Promise.resolve();
    }),

  runValidationRules,
];

export const addCustomerIBottlesValidator = [
  body('bottleQuantity').notEmpty().withMessage('Bottle Quantity is required'),

  body('isPaid').notEmpty().withMessage('Is Paid is required').isBoolean().withMessage('Invalid is Paid'),
  body('customerId')
    .notEmpty()
    .withMessage('Customer is required')
    .isMongoId()
    .withMessage('Invalid customer')
    .bail()
    .custom(async (value, { req }) => {
      const customerService = Container.get<CustomerService>(CustomerService);
      const valid = await customerService.isValidSalesExecutiveCustomer(value, req.user._id);
      if (!valid) {
        throw new Error('Invalid customer');
      }
      return Promise.resolve();
    }),
  //body('customerLocationId').notEmpty().withMessage('Customer is required').isMongoId().withMessage('Invalid customer'),

  runValidationRules,
];

export const addCouponToCustomerValidator = [
  body('coupons').notEmpty().withMessage('Coupons is required').trim().isInt().withMessage('Invalid coupon').toInt(),

  body('offerCode')
    .if(body('offerCode').exists())
    .notEmpty()
    .withMessage('Offer code is required')
    .bail()
    .custom(async (value: string) => {
      const offerService = Container.get<OfferService>(OfferService);
      const valid = await offerService.isValidOffer(value);
      if (!valid) {
        throw new Error('Invalid offer');
      }
      return Promise.resolve();
    }),

  param('id')
    .notEmpty()
    .withMessage('Customer is required')
    .isMongoId()
    .withMessage('Invalid customer')
    .bail()
    .custom(async (value, { req }) => {
      const customerService = Container.get<CustomerService>(CustomerService);
      const valid = await customerService.isValidSalesExecutiveCustomer(value, req.user._id);
      if (!valid) {
        throw new Error('Invalid customer');
      }
      return Promise.resolve();
    }),

  runValidationRules,
];
