import { IPagination } from './common/IPagination';
import { IInventory } from '../../models/interfaces/IInventory';

export interface IGetAllInventoriesOutputDataDto extends IPagination {
  inventories: IInventory[];
}
