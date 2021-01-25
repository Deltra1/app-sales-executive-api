import ApplicationError from '../../errors/ApplicationError';

export default class SystemError extends ApplicationError {
  constructor(errorObj: App.ErrorObj = {}) {
    const errorInfo = {
      message: 'System error',
      httpCode: 500,
      description: 'Some error occured',
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
