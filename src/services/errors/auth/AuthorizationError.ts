import ApplicationError from '../../../errors/ApplicationError';

export default class AuthorizationError extends ApplicationError {
  constructor(errorObj: App.ErrorObj = {}) {
    const errorInfo = {
      message: 'Access denied',
      httpCode: 401,
      description: 'You are not allowed to access this resource',
      error: null,
      ...errorObj,
    };
    super(errorInfo);
    this.name = this.constructor.name;
    if (errorInfo.error) {
      this.stack = `${this.stack}\n${errorInfo.error.stack}`;
    }
  }
}
