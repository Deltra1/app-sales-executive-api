import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import ApplicationError from '../errors/ApplicationError';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: Error, req: Request, res: Response, next: NextFunction) {
    console.log(error);
    if (error instanceof HttpError) {
      res.status(error.httpCode || 500).json(error);
    } else if (error instanceof MulterError) {
      let msg = 'Invalid file';
      if (error.code === 'LIMIT_FILE_SIZE') {
        msg = 'File size must be less than 5 MB';
      }
      res.status(500).json({
        message: msg,
        description: 'Unknown error',
        stack: error.stack,
      });
    } else {
      res.status(500).json({
        message: 'System error',
        description: 'Unknown error',
        stack: error.stack,
      });
    }
  }
}
