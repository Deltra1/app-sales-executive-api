import { CurrentUser, Body, UseBefore, Post, JsonController, Get, Param, Patch, HttpCode, QueryParams, Res, Req } from 'routing-controllers';
import { Response } from 'express';
import path from 'path';

import CustomerService from '../services/CustomerService';
import IUser from '../models/interfaces/IUser';
import ICustomer from '../models/interfaces/ICustomer';
import IOffer from '../models/interfaces/IOffer';
import { RequireAuth } from '../middlewares/AuthMiddleware';
import { ICreateCustomerResponseData } from './interfaces/responses/ICustomerResponse';
import { ValidationError } from '../middlewares/validators/ValidationError';
import {
  createCustomerValidator,
  updateCustomerValidator,
  addCustomerInventoriesValidator,
  addCouponToCustomerValidator,
  addCustomerIBottlesValidator,
} from '../middlewares/validators/CustomerMiddleware';
import {
  ICreateCustomerRequestData,
  IUpdateSalesExecutiveCustomerRequestData,
  IAddCustomerInventoryRequestData,
  IAddCustomerCouponsRequestData,
  IAddCustomerBottlesRequestData,
} from './interfaces/requests/ICustomerRequest';
import {
  ICreateCustomerInputDataDTO,
  IAddCustomerInventoryOutputDataDto,
  IAddCustomerInventoryInputDataDto,
  IAddCustomerBottlesInputDataDto,
} from '../services/interfaces/ICustomerServiceDTO';
import { uploadCustomerRouteLocationImages } from '../middlewares/uploads/uploadCustomerRouteLocationImages';
import ApplicationError from '../errors/ApplicationError';

@UseBefore(RequireAuth)
@JsonController('/customer')
export default class CustomerController {
  /**
   * Constructor
   * @param customerService
   */
  public constructor(private customerService: CustomerService) {}

  /**
   * @swagger
   * /customer:
   *  post:
   *    tags:
   *      - "customer"
   *    requestBody:
   *      $ref: '#/components/requestBodies/createCustomerRequestBody'
   *    responses:
   *      201:
   *        $ref: '#/components/responses/createCustomerResponse'
   *
   * @param user IUser
   * @param createCustomerData ICreateCustomerRequest
   */
  @HttpCode(201)
  @UseBefore(...createCustomerValidator)
  @Post('/')
  public async createCustomer(
    @CurrentUser() user: IUser,
    @Body() createCustomerData: ICreateCustomerRequestData,
  ): Promise<ICreateCustomerResponseData> {
    if (!createCustomerData.locations) {
      createCustomerData.locations = [];
    }
    createCustomerData.locations = createCustomerData.locations.map((location) => {
      const [latitude, longitude] = location.coordinates.split(/\s*,\s*/);
      return {
        ...location,
        latitude,
        longitude,
        municipality: location.municipalityId,
        route: location.routeId,
      };
    });

    const customerData: ICreateCustomerInputDataDTO = {
      ...createCustomerData,
      client: user.client,
      createdUser: user,
      address: {
        ...createCustomerData.address,
        municipality: createCustomerData.address.municipalityId,
      },
    } as ICreateCustomerInputDataDTO;
    const customer: ICustomer = await this.customerService.createCustomer(customerData);
    return customer.toJSON();
  }

  /**
   * updateSalesExecutiveCustomer
   * @param user
   * @param id
   * @param updateReqData
   */
  @HttpCode(200)
  @Patch('/:id')
  @UseBefore(...updateCustomerValidator)
  public async updateSalesExecutiveCustomer(
    @CurrentUser() user: IUser,
    @Param('id') id: string,
    @Body() updateReqData: IUpdateSalesExecutiveCustomerRequestData,
  ): Promise<object> {
    if (updateReqData.locations) {
      updateReqData.locations = updateReqData.locations.map((location) => {
        const newLocation: any = {
          ...location,
        };
        if (location.coordinates) {
          const [latitude, longitude] = location.coordinates.split(/\s*,\s*/);
          newLocation.latitude = latitude;
          newLocation.longitude = longitude;
        }
        if (newLocation.municipalityId) {
          newLocation.municipality = newLocation.municipalityId;
        }
        return newLocation;
      });
    }
    const updateData: any = {
      id,
      ...updateReqData,
    };
    if (updateReqData.address && updateReqData.address.municipalityId) {
      updateData.address.municipality = updateReqData.address.municipalityId;
    }
    const result = await this.customerService.updateSalesExecutiveCustomer(updateData, user);
    return result.toJSON();
  }

  /**
   * @swagger
   * /customer:
   *  get:
   *    tags:
   *      - "customer"
   *    description: Get All Customers
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        $ref: '#/components/responses/getAllCustomersResponse'
   *
   *
   * @param user IUser
   * Get All Customers of Sales executive
   * @return IGetAllSalesExecutiveCustomersResponseData
   */
  @HttpCode(200)
  @Get('/')
  public async getAllSalesExecutiveCustomers(@CurrentUser() user: IUser, @QueryParams() query: any, @Res() res: Response): Promise<any> {
    const allowedWhere = ['customerTypeId', 'customerId', 'name'];
    const page = parseInt(query.page, 10);
    const limit = parseInt(query.limit, 10);
    const where: any = {};
    allowedWhere.forEach((key: string) => {
      let keyname = key;
      if (query[keyname] && typeof query[keyname] === 'string') {
        if (keyname === 'customerTypeId') {
          keyname = 'customerType';
        }
        where[keyname] = query[keyname];
      }
    });
    const filterOption = { where, page, limit };
    const result = await this.customerService.getAllCustomersOfSalesExecutive(user._id, filterOption);
    res.set({
      'X-Paging-PageNo': result.page,
      'X-Paging-PageSize': result.limit,
      'X-Paging-TotalRecordCount': result.recordsTotal,
      'X-Paging-TotalFilteredRecordCount': result.recordsFiltered,
    });
    return result.customers.map((customer) => customer.toJSON());
  }

  /**
   * getSalesExecutiveCustomerDetails
   * Get Details of Customer of Sales executive
   * @param customerId strig Custmer id
   * @param user IUser user
   * @return Promise
   */
  @HttpCode(200)
  @Get('/:id([0-9a-fA-F]{24})')
  public async getSalesExecutiveCustomerDetails(@Param('id') customerId: string, @CurrentUser() user: IUser): Promise<object> {
    const result = await this.customerService.getSalesExecutiveCustomerDetails(customerId, user._id);
    return result.toJSON();
  }

  @HttpCode(200)
  @Post('/add-inventory/:id')
  @UseBefore(...addCustomerInventoriesValidator)
  public async addCustomerInventory(
    @Param('id') customerId: string,
    @CurrentUser() user: IUser,
    @Body() customerInventoryData: IAddCustomerInventoryRequestData,
  ): Promise<object> {
    if (customerInventoryData.inventories.length === 0) {
      throw new ValidationError({ message: 'Invalid Request' }, []);
    }
    const inventories = customerInventoryData.inventories.map((item) => {
      const processedDate: any = {
        isPaid: item.isPaid,
        inventory: item.inventoryId,
        amount: item.amount,
      };
      if (item.offerCode) {
        processedDate.offerCode = item.offerCode;
      }
      return processedDate;
    });
    const data: IAddCustomerInventoryInputDataDto = {
      inventories,
      customerId,
    };
    const result: IAddCustomerInventoryOutputDataDto = await this.customerService.addCustomerInventory(data, user);
    return {
      inventories: result.customerInventories.map((inventory) => inventory.toJSON()),
      order: result.order?.toJSON() || null,
      transaction: result.transaction?.toJSON() || null,
    };
  }

  @HttpCode(200)
  @Post('/add-coupon/:id')
  @UseBefore(...addCouponToCustomerValidator)
  public async addCouponsToSalesExecutiveCustomer(
    @Param('id') customerId: string,
    @CurrentUser() user: IUser,
    @Body() customerCoupnData: IAddCustomerCouponsRequestData,
  ): Promise<object> {
    const couponData = {
      customerId,
      ...customerCoupnData,
    };
    const outData = await this.customerService.addCustomerCoupons(couponData, user);
    return { order: outData.order.toJSON(), transaction: outData.transaction.toJSON() };
  }

  @HttpCode(200)
  @Post('/add-bottles')
  @UseBefore(...addCustomerIBottlesValidator)
  public async addCustomerBottles(@CurrentUser() user: IUser, @Body() customerBottleRequest: IAddCustomerBottlesRequestData): Promise<object> {
    const data = {
      customerBottleRequest,
    };
    const result = await this.customerService.addCustomerBottles(data, user);
    return result.toJSON();
  }

  @HttpCode(201)
  @Post('/add-route-images/:customerId/:locationId')
  @UseBefore(uploadCustomerRouteLocationImages)
  public async addRouteImages(
    @Req() req: any,
    @Param('customerId') customerId: string,
    @CurrentUser() user: IUser,
    @Param('locationId') locationId: string,
  ): Promise<object> {
    if (req.fileValidationError) {
      throw new ApplicationError({ message: req.fileValidationError, httpCode: 400 });
    }
    const photos = req.files.map((item: any) => path.basename(item.key));
    const customer = await this.customerService.updateSalesExecutiveCustomerRouteImages(customerId, locationId, photos, user);
    return customer.toJSON();
  }

  @HttpCode(200)
  @Get('/get-offers')
  public async getSalesExecutiveOffers(@CurrentUser() user: IUser): Promise<object> {
    const results = await this.customerService.getSalesExecutiveOffers(user.client);
    return results.map((result: any) => result.toJSON());
  }
}
