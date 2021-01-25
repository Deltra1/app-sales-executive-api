import { validationResult, Result } from 'express-validator';
import { Request, NextFunction } from 'express';

import { ValidationError } from './ValidationError';

export function runValidationRules(req: Request, res: Response, next: NextFunction) {
  const result: Result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new ValidationError({ message: 'Invalid data' }, result.array());
    return next(error);
  }
  return next();
}
