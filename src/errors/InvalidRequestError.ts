import ApplicationError from './ApplicationError';

class InvalidRequestError extends ApplicationError {
  constructor(errorObj: App.ErrorObj = {}) {
    const errorInfo = {
      message: 'Bad request',
      httpCode: 400,
      description: 'Client should not repeat this request without modification',
      error: null,
      ...errorObj,
    };
    super(errorInfo);
    this.name = this.constructor.name;
    if (errorInfo.error) {
      this.stack = `${this.stack}'\n'${errorInfo.error.stack}`;
    }
  }
}

module.exports = InvalidRequestError;
