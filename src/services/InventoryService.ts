import { Service, Inject } from 'typedi';
import { IInventoryModel } from '../models/Inventory';
import { IInventory } from '../models/interfaces/IInventory';
import SystemError from './errors/SystemError';
import ServiceError from './errors/ServiceError';
import { IInventoryType } from '../models/interfaces/IInventoryType';
import { IInventoryTypeModel } from '../models/InventoryType';
import { IGetAllInventoriesOutputDataDto } from './interfaces/IInventoryServiceDTO';
import CustomerInventory, { ICustomerInventoryModel } from '../models/CustomerInventory';
import { ICustomerInventory } from '../models/interfaces/ICustomerInventory';

@Service()
export class InventoryService {
  constructor(
    @Inject('inventoryModel') private inventoryModel: IInventoryModel,
    @Inject('inventoryTypeModel') private inventoryTypeModel: IInventoryTypeModel,
    @Inject('customerInventoryModel') private customerInventoryModel: ICustomerInventoryModel,
  ) {}

  /**
   * getInventoryById
   * @param id string
   */
  public async getInventoryById(id: string) {
    let inventory: IInventory | null;
    try {
      inventory = await this.inventoryModel.findById(id);
    } catch (error) {
      throw new SystemError({ error });
    }
    if (!inventory) {
      throw new ServiceError({ message: 'Inventory not found', httpCode: 404 });
    }
    return inventory;
  }

  /**
   * getAllInventoryTypes
   */
  public async getAllInventoryTypes(clientId): Promise<IInventoryType[]> {
    let inventoryTypes: IInventoryType[] = [];
    try {
      inventoryTypes = await this.inventoryTypeModel.find({ client: clientId });
    } catch (error) {
      throw new SystemError({ error });
    }
    return inventoryTypes;
  }

  public async getAllInventories(option: any = {}): Promise<IGetAllInventoriesOutputDataDto> {
    let inventories: IInventory[] = [];
    let recordsTotal: number = 0;
    let recordsFiltered: number = 0;
    const limit = option.limit || 10;
    const page = option.page || 1;
    const sort = option.sort || '-createdAt';
    const skip = limit * (page - 1);
    let where = option.where || null;
    const { whereOnly } = option;
    if (where && where.like) {
      const like = where.like;
      Object.keys(like).forEach((key) => {
        where[key] = {
          $regex: like[key],
        };
      });
      delete where.like;
    }
    where = { ...where, ...whereOnly };
    try {
      recordsTotal = await this.inventoryModel.countDocuments(whereOnly);
      const query = this.inventoryModel.find(where);
      if (where) {
        recordsFiltered = await this.inventoryModel.countDocuments(where);
        query.where(where);
      }
      if (sort) query.limit(limit).skip(skip).sort(sort);
      inventories = await query;
    } catch (error) {
      throw new SystemError({ error });
    }
    if (!where) {
      recordsFiltered = recordsTotal;
    }
    const result: IGetAllInventoriesOutputDataDto = {
      recordsTotal,
      recordsFiltered,
      limit,
      page,
      inventories,
    };
    return result;
  }

  /**
   * getAllCustomerInventories
   * @param customerId string
   * @return Promie<ICustomerInventory[]>
   */
  public async getAllCustomerInventories(customerId: string): Promise<ICustomerInventory[]> {
    let customerInventories: ICustomerInventory[] = [];
    try {
      customerInventories = await this.customerInventoryModel.find({ customer: customerId }).populate('inventory');
    } catch (error) {
      throw new SystemError({ error });
    }
    return customerInventories;
  }
}
