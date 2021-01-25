import { ExpressMiddlewareInterface, Action } from 'routing-controllers';
import { Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import IUser from '../models/interfaces/IUser';
import { Service } from 'typedi';

@Service()
export class RequireAuth implements ExpressMiddlewareInterface {
  constructor(private authService: AuthService) {}
  async use(req: any, res: Response, next: NextFunction) {
    const authorization: string = req.header('Authorization') || '';
    const accessToken: string = authorization.replace('Bearer ', '');
    try {
      const user: IUser = await this.authService.authenticateUser(accessToken);
      req.user = user;
    } catch (error) {
      return next(error);
    }
    return next();
  }
}

export function currentUserChecker(action: Action): IUser | undefined {
  return action.request.user;
}
