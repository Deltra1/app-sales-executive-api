import dotenv from 'dotenv';
import path from 'path';

import { getPath } from '../utils/env';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv.config({
  path: path.resolve(__dirname, '../..', `.env.${process.env.NODE_ENV}`),
});

if (!envFound) {
  throw new Error('Could not find environment file');
}

export interface IConfig {
  app: {
    port: number;
    controllersDir: string;
    middlewaresDir: string;
  };
  db: {
    mongodbUrl: string;
  };
  jwt: {
    accessToken: {
      secret: string;
      expireIn: number;
    };
    refreshToken: {
      secret: string;
      expireIn: number;
    };
  };
  company: {
    name: string;
    userIdPrefix: string;
    defaultUserPassword: string;
    adminUserId: string;
    salesExecutiveRoleName: string;
    transPrefixStr: string;
    orderIdPrefixStr: string;
    orderItemTypeInventoryId: string;
    orderItemTypeCouponId: string;
    couponPrice: number;
  };
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    s3BaseUrl: string;
    bucketName: string;
    routeLocationImagesDir: string;
  };
}

const config: IConfig = {
  app: {
    port: parseInt(process.env.PORT || '', 10),
    controllersDir: getPath(process.env.CONTROLLERS_DIR),
    middlewaresDir: getPath(process.env.MIDDLEWARES_DIR),
  },
  db: {
    mongodbUrl: process.env.MONGODB_URL || '',
  },
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || '',
      expireIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '', 10),
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET || '',
      expireIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '', 10),
    },
  },
  company: {
    name: process.env.COMPANY_NAME || '',
    userIdPrefix: process.env.COMPANY_USER_ID_PREFIX || '',
    defaultUserPassword: process.env.DEFAULT_USER_PASSWORD || '',
    adminUserId: process.env.ADMIN_USER_ID || '',
    salesExecutiveRoleName: process.env.ROLE_NAME_SALES_EXECUTIVE || '',
    transPrefixStr: process.env.TRANS_PREFIX_STR || '',
    orderIdPrefixStr: process.env.ORDER_ID_PREFIX_STR || '',
    orderItemTypeInventoryId: process.env.ORDER_ITEM_TYPE_INVENTORY_ID || '',
    orderItemTypeCouponId: process.env.ORDER_ITEM_TYPE_COUPON_ID || '',
    couponPrice: parseInt(process.env.COUPON_PRICE || '', 10),
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucketName: process.env.AWS_S3_BUCKET_NAME || '',
    routeLocationImagesDir: process.env.AWS_ROUTE_LOCATION_IMAGES_DIR || '',
    s3BaseUrl: process.env.AWS_S3_BASE_URL || '',
  },
};

export default config;
