import ApplicationError from '../../../errors/ApplicationError';

export default class AuthenticationError extends ApplicationError {
  constructor(errorObj: App.ErrorObj = {}) {
    const errorInfo = {
      message: 'Invalid Credentials',
      httpCode: 401,
      description: 'Invalid login credentials',
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
