import db from './db';
import Customer from '../models/Customer';
import Counter from '../models/Counter';
import iocLoader from './iocLoader';
import expressLoader from './expressLoader';
import User from '../models/User';
import Municipality from '../models/Municipality';
import Inventory from '../models/Inventory';
import Offer from '../models/Offer';
import CustomerOffer from '../models/CustomerOffer';
import TransSeqNo from '../models/TransSeqNo';
import OrderSeqNo from '../models/OrderSeqNo';
import Transaction from '../models/Transaction';
import Order from '../models/Order';
import CustomerInventory from '../models/CustomerInventory';
import InventoryType from '../models/InventoryType';
import Client from '../models/Client';
import Route from '../models/Route';
import SalesmanTrip from '../models/SalesmanTrip';
import CustomerBottles from '../models/CustomerBottles';
import swaggerLoader from './swaggerLoader';
import WaterBottlesUpdateHistory from '../models/WaterBottlesUpdateHistory';
import CustomerCoupon from '../models/CustomerCoupon';

export default async (config: any) => {
  const connection = await db();
  const models = [
    { name: 'customerModel', model: Customer },
    { name: 'counterModel', model: Counter },
    { name: 'userModel', model: User },
    { name: 'municipalityModel', model: Municipality },
    { name: 'inventoryModel', model: Inventory },
    { name: 'offerModel', model: Offer },
    { name: 'customerOfferModel', model: CustomerOffer },
    { name: 'transSeqNoModel', model: TransSeqNo },
    { name: 'orderSeqNoModel', model: OrderSeqNo },
    { name: 'transactionModel', model: Transaction },
    { name: 'orderModel', model: Order },
    { name: 'customerInventoryModel', model: CustomerInventory },
    { name: 'inventoryTypeModel', model: InventoryType },
    { name: 'clientModel', model: Client },
    { name: 'routeModel', model: Route },
    { name: 'salesmanTripModel', model: SalesmanTrip },
    { name: 'customerBottlesModel', model: CustomerBottles },
    { name: 'waterBottlesUpdateHistoryModel', model: WaterBottlesUpdateHistory },
    { name: 'customerCouponModel', model: CustomerCoupon },
  ];
  iocLoader(models, connection);
  const app = expressLoader(config);
  swaggerLoader(app);
};
