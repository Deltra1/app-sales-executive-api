import { Service, Inject } from 'typedi';
import { Connection, ClientSession } from 'mongoose';
import moment from 'moment';

import { IConfig } from '../config';
import { ICustomerModel } from '../models/Customer';
import ICustomer from '../models/interfaces/ICustomer';
import SystemError from './errors/SystemError';
import { ICounterModel } from '../models/Counter';
import ICounter from '../models/interfaces/ICounter';
import ServiceError from './errors/ServiceError';
import IUser from '../models/interfaces/IUser';
import { IInventoryModel } from '../models/Inventory';
import { IOfferModel } from '../models/Offer';
import { ICustomerOfferModel } from '../models/CustomerOffer';
import { ITransSeqNoModel } from '../models/TransSeqNo';
import { IOrderSeqNoModel } from '../models/OrderSeqNo';
import { ITransactionModel } from '../models/Transaction';
import { TransType, ITransaction } from '../models/interfaces/ITransaction';
import { IOrderModel } from '../models/Order';
import { ICustomerCouponModel } from '../models/CustomerCoupon';
import { OrderStatus, IOrder, OrderItemType } from '../models/interfaces/IOrder';
import { ICustomerInventoryModel } from '../models/CustomerInventory';
import { IOffer } from '../models/interfaces/IOffer';
import { IInventory } from '../models/interfaces/IInventory';
import { IInventoryType } from '../models/interfaces/IInventoryType';
import { ICustomerInventory } from '../models/interfaces/ICustomerInventory';
import { IClientModel } from '../models/Client';
import { ISalesManTripModel } from '../models/SalesmanTrip';
import { ICustomerBottlesModel } from '../models/CustomerBottles';
import { IWaterBottlesUpdateHistoryModel } from '../models/WaterBottlesUpdateHistory';
import {
  ICreateCustomerInputDataDTO,
  IUpdateCustomerInputDataDTO,
  IAddCustomerInventoryInputDataDto,
  IAddCustomerInventoryOutputDataDto,
  IAddCustomerCouponInputDataDto,
  IAddCustomerCouponOutputDataDto,
  IGetAllCustomersOfSalesExecutiveOutputDTO,
  IAddCustomerBottlesInputDataDto,
} from './interfaces/ICustomerServiceDTO';
import { ICustomerBottles } from '../models/interfaces/ICustomerBottles';
import { ICustomerCoupon } from '../models/interfaces/ICustomerCoupon';
import { IInventoryTypeModel } from '../models/InventoryType';

@Service()
export default class CustomerService {
  /**
   * Constructor
   * @param customerModel ICustomerModel
   * @param counterModel ICounterModel
   * @param config IConfig
   */
  public constructor(
    @Inject('customerModel') private customerModel: ICustomerModel,
    @Inject('counterModel') private counterModel: ICounterModel,
    @Inject('inventoryModel') private inventoryModel: IInventoryModel,
    @Inject('offerModel') private offerModel: IOfferModel,
    @Inject('customerOfferModel') private customerOfferModel: ICustomerOfferModel,
    @Inject('transSeqNoModel') private transSeqNoModel: ITransSeqNoModel,
    @Inject('orderSeqNoModel') private orderSeqNoModel: IOrderSeqNoModel,
    @Inject('transactionModel') private transactionModel: ITransactionModel,
    @Inject('orderModel') private orderModel: IOrderModel,
    @Inject('customerInventoryModel') private customerInventoryModel: ICustomerInventoryModel,
    @Inject('clientModel') private clientModel: IClientModel,
    @Inject('salesmanTripModel') private salesmanTripModel: ISalesManTripModel,
    @Inject('customerBottlesModel') private customerBottlesModel: ICustomerBottlesModel,
    @Inject('waterBottlesUpdateHistoryModel') private waterBottlesUpdateHistoryModel: IWaterBottlesUpdateHistoryModel,
    @Inject('customerCouponModel') private customerCouponModel: ICustomerCouponModel,
    @Inject('inventoryTypeModel') private inventoryTypeModel: IInventoryTypeModel,
    @Inject('config') private config: IConfig,
    @Inject('dbConnection') private dbConnection: Connection,
  ) {}

  /**
   * createCustomerId
   * @param session ClientSession
   */
  private async createCustomerId(customerPrefix: string, session: ClientSession): Promise<string> {
    // bug in findByIdAndUpdate
    const counter = (await this.counterModel.findByIdAndUpdate(
      { _id: `customer_${customerPrefix}` },
      { $inc: { seq: 1 } },
      { session, new: true, upsert: true },
    )) as ICounter;
    const userId = customerPrefix + counter.seq.toString().padStart(5, '0');
    return userId;
  }

  /**
   * createCustomer
   * @param customerData
   * @return Promise<ICustomer>
   */
  public async createCustomer(customerData: ICreateCustomerInputDataDTO): Promise<ICustomer> {
    const customer: ICustomer = new this.customerModel(customerData);

    let client;
    try {
      client = await this.clientModel.findById(customerData.client);
    } catch (error) {
      throw new SystemError({ error });
    }
    if (!client) {
      throw new ServiceError({ httpCode: 404, message: 'Client not found' });
    }

    const session: ClientSession = await this.dbConnection.startSession();
    session.startTransaction();
    try {
      customer.client = client.id;
      customer.changePassword = true;
      customer.isActive = true;
      customer.createdBy = customerData.createdUser._id;
      customer.updatedBy = customerData.createdUser._id;
      customer.coupons = 0;
      if (customerData.openingCouponBalance) {
        customer.openingCouponBalance = customerData.openingCouponBalance;
        customer.coupons = customerData.openingCouponBalance;
      }

      if (customerData.locations) {
        customer.locations = customerData.locations.map((location) => {
          const { latitude, longitude } = location;
          delete location.latitude;
          delete location.longitude;
          const newLocation = {
            ...location,
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            photos: [],
          };
          return newLocation;
        });
      }

      // create customer id
      const customerId: string = await this.createCustomerId(client.companyCustomerPrefix, session);
      customer.customerId = customerId;
      customer.password = customerId;

      // save
      await customer.save({ session });
      await session.commitTransaction();
    } catch (error) {
      /* istanbul ignore next */
      await (async () => {
        await session.abortTransaction();
        throw new SystemError({ error });
      })();
    } finally {
      session.endSession();
    }
    return customer;
  }

  /**
   * updateSalesExecutiveCustomer
   */
  public async updateSalesExecutiveCustomer(data: IUpdateCustomerInputDataDTO, user: IUser): Promise<ICustomer> {
    const customer: ICustomer = await this.getSalesExecutiveCustomerById(data.id, user._id);
    const updateData: any = data;
    if (updateData.name) {
      customer.name = updateData.name;
    }
    if (updateData.email) {
      customer.email = updateData.email;
    }
    if (updateData.phoneNumber) {
      customer.phoneNumber = updateData.phoneNumber;
    }
    if (updateData.address) {
      if (updateData.address.buildingNumber) {
        customer.address.buildingNumber = updateData.address.buildingNumber;
      }
      if (updateData.address.flatNumber) {
        customer.address.flatNumber = updateData.address.flatNumber;
      }
      if (updateData.address.floorNumber) {
        customer.address.floorNumber = updateData.address.floorNumber;
      }
      if (updateData.address.landmark) {
        customer.address.landmark = updateData.address.landmark;
      }
      if (updateData.address.municipality) {
        customer.address.municipality = updateData.address.municipality;
      }
      if (updateData.address.zone) {
        customer.address.zone = updateData.address.zone;
      }
      if (updateData.address.street) {
        customer.address.street = updateData.address.street;
      }
    }
    if (updateData.locations) {
      updateData.locations.forEach((location: any) => {
        if (location.id) {
          const index = customer.locations.findIndex((loc: any) => loc._id.equals(location.id));
          if (location.buildingNumber) {
            customer.locations[index].buildingNumber = location.buildingNumber;
          }
          if (location.street) {
            customer.locations[index].street = location.street;
          }
          if (location.zone) {
            customer.locations[index].zone = location.zone;
          }
          if (location.municipality) {
            customer.locations[index].municipality = location.municipality;
          }
          if (location.landmark) {
            customer.locations[index].landmark = location.landmark;
          }
          if (location.flatNumber) {
            customer.locations[index].flatNumber = location.flatNumber;
          }
          if (location.floorNumber) {
            customer.locations[index].floorNumber = location.floorNumber;
          }
          if (location.latitude && location.longitude) {
            customer.locations[index].location = {
              type: 'Point',
              coordinates: [location.longitude, location.latitude],
            };
          }
        } else {
          location.location = {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
          };
          delete location.latitude;
          delete location.longitude;
          customer.locations.push(location);
        }
      });
    }
    customer.updatedBy = user._id;
    return await customer.save();
  }

  /**
   * getCustomerByEmail
   * Get Customer by email
   * @param email string
   */
  public async getCustomerByEmail(email: string): Promise<ICustomer | null> {
    try {
      const customers: ICustomer | null = await this.customerModel.findOne({ email });
      return customers;
    } catch (error) {
      /* istanbul ignore next */
      throw new SystemError({ error });
    }
  }

  /**
   * getCustomerBy Phone Number
   * Get Customer by Phone Number
   * @param phoneNumber number
   */
  public async getCustomerByPhoneNumber(phoneNumber: number): Promise<ICustomer | null> {
    try {
      const customers: ICustomer | null = await this.customerModel.findOne({ phoneNumber });
      return customers;
    } catch (error) {
      /* istanbul ignore next */
      throw new SystemError({ error });
    }
  }

  /**
   * getCustomerById
   * Get Customer by customer id
   * @param customer id  string
   */
  public async getCustomerById(customerId: string): Promise<ICustomer | null> {
    try {
      const customers: ICustomer | null = await this.customerModel.findById(customerId);
      return customers;
    } catch (error) {
      /* istanbul ignore next */
      throw new SystemError({ error });
    }
  }

  /**
   * isValidSalesExecutiveCustomer
   * @param id string
   * @param user IUser
   */
  public async isValidSalesExecutiveCustomer(id: string, user: IUser) {
    let customer;
    try {
      customer = await this.customerModel.findOne({ _id: id, createdBy: user._id });
    } catch (error) {
      throw new SystemError({ error });
    }
    if (customer) {
      return true;
    }
    return false;
  }

  /**
   * getAllCustomersOfSalesExecutive
   * Get all customers of sales executive
   * @param salesExecutiveId string sales executive id
   * @return Promise<ICustomer[]>
   */
  public async getAllCustomersOfSalesExecutive(salesExecutiveId: string, filterOption: any = {}): Promise<IGetAllCustomersOfSalesExecutiveOutputDTO> {
    let customers: ICustomer[] = [];
    let recordsTotal: number = 0;
    let recordsFiltered: number = 0;
    const limit = filterOption.limit || 10;
    const page = filterOption.page || 1;
    const skip = (page - 1) * limit;
    const sort = '-_id';
    const where = filterOption.where || {};
    where.createdBy = salesExecutiveId;
    const totalResultWhere = { createdBy: salesExecutiveId };
    try {
      recordsTotal = await this.customerModel.countDocuments(totalResultWhere);
      recordsFiltered = await this.customerModel.countDocuments(where);
      customers = await this.customerModel.find(where).sort(sort).skip(skip).limit(limit);
    } catch (error) {
      /* istanbul ignore next */
      throw new SystemError({ error });
    }
    const result: IGetAllCustomersOfSalesExecutiveOutputDTO = {
      recordsTotal,
      recordsFiltered,
      page,
      limit,
      customers,
    };
    return result;
  }

  /**
   * getSalesExecutiveCustomerById
   * @param customerId string
   * @param salesExecutiveId strig
   */
  public async getSalesExecutiveCustomerById(customerId: string, salesExecutiveId: string): Promise<ICustomer> {
    let customer: ICustomer | null;
    try {
      customer = await this.customerModel.findOne({ _id: customerId, createdBy: salesExecutiveId });
    } catch (error) {
      /* istanbul ignore next */
      throw new SystemError({ error });
    }
    if (!customer) {
      throw new ServiceError({ message: 'Customer not found', httpCode: 404 });
    }
    return customer;
  }

  /**
   * getSalesExecutiveCustomerDetails
   * @param customerId
   * @param salesExecutiveId
   */
  public async getSalesExecutiveCustomerDetails(customerId: string, salesExecutiveId: string): Promise<ICustomer> {
    let customer: ICustomer | null;
    try {
      customer = await this.customerModel
        .findOne({ _id: customerId, createdBy: salesExecutiveId })
        .populate('address.municipality')
        .populate('locations.municipality')
        .populate('locations.route');
    } catch (error) {
      /* istanbul ignore next */
      throw new SystemError({ error });
    }
    if (!customer) {
      throw new ServiceError({ message: 'Customer Not found', httpCode: 404 });
    }
    return customer;
  }

  private async generateTransNo(transactionPrefix: string, session: ClientSession) {
    const prefix = transactionPrefix + parseInt(moment(new Date()).format('YYMMDD'), 10);
    const transSeqNo = await this.transSeqNoModel.findOneAndUpdate({ prefix }, { $inc: { count: 1 } }, { session, upsert: true, new: true });
    return prefix + transSeqNo.count.toString().padStart(6, '0');
  }

  private async generateOrderId(orderPrefix: string, session: ClientSession) {
    const prefix = orderPrefix + parseInt(moment(new Date()).format('YYMMDD'), 10);
    const transSeqNo = await this.orderSeqNoModel.findOneAndUpdate({ prefix }, { $inc: { count: 1 } }, { session, upsert: true, new: true });
    return prefix + transSeqNo.count.toString().padStart(6, '0');
  }

  public async addCustomerInventory(data: IAddCustomerInventoryInputDataDto, user: IUser): Promise<IAddCustomerInventoryOutputDataDto> {
    // total price
    let totalAmount = 0;
    let hasPaid = false;
    const orderItems = [];
    let customerInventories = [];
    const inventoryIds = [];
    let salesmanTrip: any;
    let inventoryTypeDetails: any;
    let client;
    try {
      client = await this.clientModel.findById(user.client);
    } catch (error) {
      throw new SystemError({ error });
    }
    if (!client) {
      throw new ServiceError({ httpCode: 404, message: 'Client not found' });
    }
    let daystart = moment().startOf('day').toDate();
    let dayend = moment().endOf('day').toDate();

    for (const item of data.inventories) {
      const orderItem: any = { quantity: 1, inventory: item.inventory };

      //check wether sales executive got sufficient stock
      const inventoryDetails: any = await this.inventoryModel.findById(item.inventory);
      if (inventoryDetails.inventoryType) {
        salesmanTrip = await this.salesmanTripModel.findOne({
          $query: {
            assignedTo: user._id,
            journeyStatus: { $in: ['PENDING', 'STARTED'] },
            scheduleDate: { $gte: daystart, $lt: dayend },
          },
          $orderby: { _id: -1 },
        });

        if (!salesmanTrip) {
          throw new ServiceError({ httpCode: 404, message: 'No Sales Executive Trip found' });
        }
        const index = salesmanTrip.inventoryStock.findIndex(
          (inventory: any) => inventory.inventoryType.toString() === inventoryDetails.inventoryType.toString(),
        );
        if (index === -1) {
          throw new ServiceError({ httpCode: 404, message: 'Inventory is not included in the sales trip' });
        }

        if (salesmanTrip.inventoryStock[index].remainingStock < 1) {
          throw new ServiceError({ httpCode: 404, message: 'Not Enough Stock Found' });
        }
        salesmanTrip.inventoryStock[index].remainingStock = salesmanTrip.inventoryStock[index].remainingStock - 1;
        salesmanTrip.inventoryStock[index].isPaid = item.isPaid;
        salesmanTrip.journeyStatus = 'STARTED';
        salesmanTrip.totalInventorySoldAmount = salesmanTrip.totalInventorySoldAmount + item.amount;

        await salesmanTrip.save();
      }

      const customerInventory: any = {
        inventory: item.inventory,
        customer: data.customerId,
        salesTripID: salesmanTrip._id,
        issuedAt: new Date(),
        isActive: true,
        createdBy: user._id,
        updatedBy: user._id,
      };
      // check paid inventory or free
      inventoryIds.push(item.inventory);
      if (item.isPaid) {
        hasPaid = true;
        let reducedAmount = 0;
        // if item has offer code then reduce that discount amount

        const inventoryDetails: IInventory | null = await this.inventoryModel.findById(item.inventory);
        if (!inventoryDetails) {
          throw new ServiceError({ message: 'Invalid inventory' });
        }

        if (item.offerCode) {
          const offer: IOffer | null = await this.offerModel.findOne({ offerCode: item.offerCode });
          if (!offer) {
            throw new ServiceError({ message: 'Invalid request' });
          }

          reducedAmount = (parseFloat(inventoryDetails.price.toString()) / 100) * offer.discount;
          orderItem.offer = offer._id;
        }
        const itemPrice = parseFloat(inventoryDetails.price.toString()) - reducedAmount;
        orderItem.amount = itemPrice;
        totalAmount += itemPrice;
      }
      customerInventory.isPaid = hasPaid;
      orderItem.remark = 'Inventory created by sales executive';
      orderItem.orderItemType = OrderItemType.INVENTORY;
      orderItems.push(orderItem);
      customerInventories.push(customerInventory);

      inventoryTypeDetails = await this.inventoryTypeModel.findById(inventoryDetails.inventoryType);
      inventoryTypeDetails.count = inventoryTypeDetails.count - 1;
      await inventoryTypeDetails.save();
    }

    // session start
    const session: ClientSession = await this.dbConnection.startSession();
    let customerInventoryData: ICustomerInventory[];
    let order: IOrder | null = null;
    let transaction: ITransaction | null = null;
    session.startTransaction();
    try {
      if (hasPaid) {
        // generate transaction sequence number
        const transId = await this.generateTransNo(client.transactionPrefix, session);

        // if paid inventory then generate new order number
        const orderId = await this.generateOrderId(client.orderPrefix, session);
        // create new transaction
        transaction = new this.transactionModel({
          client: client._id,
          transId,
          transType: TransType.CREDIT,
          transDate: new Date(),
          transAmount: totalAmount,
          remark: 'Inventory created by sales executive',
          createdBy: user._id,
          updatedBy: user._id,
        });

        await transaction.save({ session });

        order = new this.orderModel({
          client: client._id,
          orderId,
          totalAmount,
          customer: data.customerId,
          status: OrderStatus.COMPLETED,
          transactions: [transaction._id],
          orderDate: new Date(),
          items: orderItems,
          createdBy: user._id,
          updatedBy: user._id,
        });
        await order.save({ session });
        // add order id to customer inventory data
        customerInventories = customerInventories.map((item) => {
          if (order) {
            item.order = order._id;
            return item;
          }
          return item;
        });
      }
      customerInventoryData = await this.customerInventoryModel.create(customerInventories, {
        session,
      });

      await this.inventoryModel.updateMany({ _id: { $in: inventoryIds } }, { isAvailable: false }, { session, multi: true });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new SystemError({ error });
    } finally {
      session.endSession();
    }
    const outData: IAddCustomerInventoryOutputDataDto = {
      customerInventories: customerInventoryData,
    };
    if (order) {
      outData.order = order;
    }
    if (transaction) {
      outData.transaction = transaction;
    }
    return outData;
  }

  public async addCustomerCoupons(data: IAddCustomerCouponInputDataDto, user: IUser): Promise<IAddCustomerCouponOutputDataDto> {
    let client;
    let salesmanTrip;
    //check wether sales executive got sals Trip
    let daystart = moment().startOf('day').toDate();
    let dayend = moment().endOf('day').toDate();
    salesmanTrip = await this.salesmanTripModel.findOne({
      $query: {
        assignedTo: user._id,
        journeyStatus: { $in: ['PENDING', 'STARTED'] },
        scheduleDate: { $gte: daystart, $lt: dayend },
      },
      $orderby: { _id: -1 },
    });

    if (!salesmanTrip) {
      throw new ServiceError({ httpCode: 404, message: 'No Sales Executive Trip found' });
    }

    try {
      client = await this.clientModel.findById(user.client);
    } catch (error) {
      throw new SystemError({ error });
    }
    if (!client) {
      throw new ServiceError({ httpCode: 404, message: 'Client not found' });
    }
    // load customer
    const customer = await this.getSalesExecutiveCustomerById(data.customerId, user._id);
    let offer: IOffer | null = null;
    if (data.offerCode) {
      try {
        offer = await this.offerModel.findOne({ offerCode: data.offerCode });
      } catch (error) {
        throw new SystemError({ error });
      }
      if (!offer) {
        throw new ServiceError({ message: 'Invalid offer code' });
      }

      // check wether customer has particular offer
      let customerOffer;
      try {
        customerOffer = await this.customerOfferModel.findOne({ offerId: offer.id, customerId: data.customerId, isUsed: false });
      } catch (error) {
        throw new SystemError({ error });
      }
      if (!customerOffer) {
        throw new SystemError({ message: 'Offer not found for the customer' });
      }
      // update customer offer as used
      customerOffer.isUsed = true;
      customerOffer.save();
    }

    // calculate total amount
    let totalAmount = data.coupons * client.couponPrice;
    let discount = 0;
    // check customer already have discount
    if (customer.couponDiscount) {
      discount += customer.couponDiscount;
    }
    // check offer
    if (offer) {
      discount += offer.discount;
    }

    if (discount > 0) {
      totalAmount = totalAmount - (totalAmount / 100) * discount;
    }

    const orderItem: any = {
      orderItemType: OrderItemType.COUPON,
      amount: totalAmount,
      quantity: data.coupons,
      remark: 'Coupon credited by sales executive',
    };
    // save to new collection called cusomer coupon for getting correct sales report
    const customerCoupon: ICustomerCoupon = {
      couponQuantity: data.coupons,
      amount: totalAmount,
      customer: customer._id,
      salesTripID: salesmanTrip._id,
      issuedAt: new Date(),
      createdBy: user._id,
    };

    if (offer) {
      orderItem.offer = offer._id;
      customerCoupon.offer = offer._id;
    }

    const session = await this.dbConnection.startSession();
    session.startTransaction();
    let order: IOrder;
    let transaction: ITransaction;
    try {
      // generate transaction sequence number
      const transId = await this.generateTransNo(client.transactionPrefix, session);

      // if paid inventory then generate new order number
      const orderId = await this.generateOrderId(client.orderPrefix, session);

      // create new transaction
      transaction = new this.transactionModel({
        client: client._id,
        transId,
        transType: TransType.CREDIT,
        transDate: new Date(),
        transAmount: totalAmount,
        remark: 'Inventory created by sales executive',
        createdBy: user._id,
        updatedBy: user._id,
      });
      await transaction.save({ session });

      order = new this.orderModel({
        client: client._id,
        orderId,
        totalAmount,
        customer: data.customerId,
        status: OrderStatus.COMPLETED,
        transactions: [transaction._id],
        orderDate: new Date(),
        items: [orderItem],
        createdBy: user._id,
        updatedBy: user._id,
      });
      await order.save({ session });
      const customerCouponModel = new this.customerCouponModel(customerCoupon);
      await customerCouponModel.save({ session });
      // update copons for the customer
      customer.coupons = customer.coupons + data.coupons;
      await customer.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new SystemError({ error });
    } finally {
      session.endSession();
    }
    return { order, transaction };
  }

  public async addCustomerBottles(data: IAddCustomerBottlesInputDataDto, user: IUser): Promise<any> {
    let hasPaid = false;
    let client;
    const requestData = data.customerBottleRequest;

    if (requestData.bottleQuantity <= 0) {
      throw new ServiceError({ httpCode: 422, message: 'Bottle quantity must be greater than zero' });
    }
    // check wether  customer is valid
    const customer = await this.getCustomerById(requestData.customerId);
    if (!customer) {
      throw new ServiceError({ httpCode: 422, message: 'Customer not found' });
    }
    try {
      client = await this.clientModel.findById(user.client);
    } catch (error) {
      throw new SystemError({ error });
    }
    if (!client) {
      throw new ServiceError({ httpCode: 422, message: 'Client not found' });
    }

    //check wether sales executive data is there

    let daystart = moment().startOf('day').toDate();
    let dayend = moment().endOf('day').toDate();
    const today = new Date().toISOString();
    let tomorrow = new Date(today);
    const salesmanTrip: any = await this.salesmanTripModel.findOne({
      $query: {
        assignedTo: user._id,
        journeyStatus: { $in: ['PENDING', 'STARTED'] },
        scheduleDate: { $gte: daystart, $lt: dayend },
      },
      $orderby: { _id: -1 },
    });

    if (!salesmanTrip) {
      throw new ServiceError({ httpCode: 422, message: 'No Sales Executive Trip found' });
    }

    //check wether sales executive got sufficient stocks
    if (salesmanTrip.remainigBottleStock < requestData.bottleQuantity) {
      throw new ServiceError({ httpCode: 422, message: 'Not enough stock found' });
    }

    let customerBottles: ICustomerBottles = {};
    //check isPaid is false
    if (requestData.isPaid === true) {
      let deliverySchedule = { deliveries: [] };

      //get customer type

      if (customer.customerType === 'CREDIT_CUSTOMER') {
        if (!requestData.deliveryNoteNumber) {
          throw new ServiceError({ httpCode: 422, message: 'Invalid delivery Note number' });
        }
        customerBottles.deliveryNoteNumber = requestData.deliveryNoteNumber;
      }

      if (customer.customerType === 'CASH_CUSTOMER') {
        if (!requestData.receiptNumber) {
          throw new ServiceError({ httpCode: 422, message: 'Invalid receipt number' });
        }
        customerBottles.receiptNumber = requestData.receiptNumber;
      }
      if (customer.customerType === 'COUPON_CUSTOMER') {
        customer.coupons = customer.coupons - requestData.bottleQuantity;
      }
    }
    // customerBottles.customerType = customer.customerType;
    customerBottles.bottleQuantity = requestData.bottleQuantity;
    customerBottles.customer = requestData.customerId;
    customerBottles.salesTripID = salesmanTrip._id;
    customerBottles.amount = requestData.amount;

    //customerBottles.customerLocation = requestData.customerLocationId;
    customerBottles.issuedAt = new Date();
    customerBottles.isPaid = requestData.isPaid;
    customerBottles.createdBy = user._id;
    const CustomerBottles = this.customerBottlesModel;
    const saveCustomerBottles = new CustomerBottles(customerBottles);
    client.waterBottles = client.waterBottles - requestData.bottleQuantity;
    // add water bottles update history
    const waterBottlesUpdateHistoryData = {
      client: user.client,
      removed: requestData.bottleQuantity,
      updatedDate: new Date(),
      waterBottles: client.waterBottles,
      updatedBy: user._id,
      createdBy: user._id,
    };

    const WaterBottlesUpdateHistory = this.waterBottlesUpdateHistoryModel;
    const waterBottlesUpdateHistory = new WaterBottlesUpdateHistory(waterBottlesUpdateHistoryData);
    // session start
    const session = await this.dbConnection.startSession();
    //substarc in hand stock from sales executive
    salesmanTrip.remainigBottleStock = salesmanTrip.remainigBottleStock - requestData.bottleQuantity;
    salesmanTrip.journeyStatus = 'STARTED';
    salesmanTrip.totalBottlesSoldAmount = salesmanTrip.totalBottlesSoldAmount + requestData.amount;
    session.startTransaction();

    try {
      await client.save();
      await waterBottlesUpdateHistory.save();
      await saveCustomerBottles.save();
      await customer.save();
      await salesmanTrip.save();
    } catch (error) {
      await session.abortTransaction();
      throw new SystemError({ error });
    } finally {
      session.endSession();
    }
    return saveCustomerBottles;
  }

  /**
   * updateSalesExecutiveCustomerRouteImages
   * @param customerId string
   * @param locationId string
   * @param photos string[]
   * @param user IUser
   */
  public async updateSalesExecutiveCustomerRouteImages(customerId: string, locationId: string, photos: string[], user: IUser) {
    const customer = await this.getSalesExecutiveCustomerById(customerId, user._id);
    const locationIndex = customer.locations.findIndex((loc: any) => loc._id.toString() === locationId);
    if (locationIndex < 0) {
      throw new ServiceError({ message: 'Invalid customer location', httpCode: 400 });
    }
    photos.forEach((photo: string) => {
      customer.locations[locationIndex].photos.push(photo);
    });
    customer.locations[locationIndex].photos = customer.locations[locationIndex].photos.slice(-4);
    await customer.save();
    return customer;
  }

  public async getSalesExecutiveOffers(clientId: String) {
    let client = null;
    try {
      console.log(clientId, 'clientId');
      client = await this.clientModel.findById(clientId);
    } catch (error) {
      throw new SystemError({ error });
    }
    if (!client) {
      throw new ServiceError({ httpCode: 422, message: 'Client not found' });
    }

    let dayStart = moment().startOf('day').toDate();
    const offers = await this.offerModel.find({ client: clientId, startDate: { $lte: dayStart }, endDate: { $gt: dayStart } });
    if (offers.length === 0) {
      throw new ServiceError({ message: 'No Offers Found', httpCode: 422 });
    }
    return offers;
  }
}
