import { CurrentUser, Get, HttpCode, UseBefore, JsonController, QueryParams, Res, Param } from 'routing-controllers';
import { Response } from 'express';

import { InventoryService } from '../services/InventoryService';
import { RequireAuth } from '../middlewares/AuthMiddleware';
import IUser from '../models/interfaces/IUser';

@UseBefore(RequireAuth)
@JsonController('/inventory')
export class InventoryController {
  public constructor(private inventoryService: InventoryService) {}

  /**
   * @swagger
   * /inventory:
   *  get:
   *    tags:
   *      - 'inventory'
   *    description: Get all inventories
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        $ref: '#/components/responses/getAllInventoriesResponse'
   *
   * @param query any
   * @param res Promise
   */
  @HttpCode(200)
  @Get('/')
  public async getAllInventories(@CurrentUser() user: IUser, @QueryParams() query: any, @Res() res: Response) {
    const allowedWhere = ['isAvailable', 'inventoryType'];
    const allowedLikeWhere = ['serialNumber'];
    const limit = parseInt(query.limit, 10);
    const page = parseInt(query.page, 10);
    const where: any = {};
    allowedWhere.forEach((key) => {
      if (query[key] && typeof query[key] === 'string') {
        where[key] = query[key];
      }
    });
    if (query.like) {
      where.like = {};
      allowedLikeWhere.forEach((key) => {
        if (query.like[key] && typeof query.like[key] === 'string') {
          where.like[key] = query.like[key];
        }
      });
    }
    const whereOnly = {
      client: user.client,
    };
    const filterOption = { where, whereOnly, page, limit };
    const result = await this.inventoryService.getAllInventories(filterOption);
    //console.log(filterOption, 'filterOption Here');
    res.set({
      'X-Paging-PageNo': result.page,
      'X-Paging-PageSize': result.limit,
      'X-Paging-TotalRecordCount': result.recordsTotal,
      'X-Paging-TotalFilteredRecordCount': result.recordsFiltered,
    });
    return result.inventories.map((inventory: any) => inventory.toJSON());
  }

  /**
   * @swagger
   * /inventory/customer/{customerId}:
   *  get:
   *    tags:
   *      - 'inventory'
   *    description: Get all customer inventories
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        $ref: '#/components/responses/getAllCustomerInventoriesResponse'
   * @param customerId string
   */
  @HttpCode(200)
  @Get('/customer/:id')
  public async getAllCustomerInventories(@Param('id') customerId: string): Promise<any> {
    const customerInventories = await this.inventoryService.getAllCustomerInventories(customerId);
    return customerInventories.map((inventory) => inventory.toJSON());
  }

  @HttpCode(200)
  @Get('/inventory-type')
  public async getAllInventoryTypes(@CurrentUser() user: IUser): Promise<any> {
    const inventoryTypes = await this.inventoryService.getAllInventoryTypes(user.client);
    return inventoryTypes.map((inventoryType: any) => inventoryType.toJSON());
  }
}
