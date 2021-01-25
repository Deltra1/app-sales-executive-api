import * as aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidV4 } from 'uuid';
import { Container } from 'typedi';
import { IConfig } from '../../config/';

export const uploadCustomerRouteLocationImages = async (request: any, res: any, next: any) => { 
  const config = Container.get<IConfig>('config');
  const s3 = new aws.S3({
    credentials: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
    },
  });
  return await multer({
    storage: multerS3({
      s3,
      bucket: config.aws.bucketName,
      acl: 'public-read',
      key: (req, file, cb) => {
        let fileExt = '.png';
        if (file.mimetype === 'image/jpeg') {
          fileExt = '.jpg';
        }
        cb(null, `${config.aws.routeLocationImagesDir}/${uuidV4()}${fileExt}`);
      },
    }),
    limits: {
      fileSize: 500000,
      files: 4,
      parts: 4,
    },
    fileFilter: (req: any, file, cb) => {
      if (file.mimetype === 'image/jpeg') {
        return cb(null, true);
      }
      if (file.mimetype === 'image/png') {
        return cb(null, true);
      }
      req.fileValidationError = 'Invalid file type';
      return cb(null, false);
    },
  }).array('photo', 4)(request, res, next);
};
