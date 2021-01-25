import ApplicationError from '../../errors/ApplicationError';

export class ValidationError extends ApplicationError {
  private fields: object[];

  constructor(errorObj: App.ErrorObj = {}, fields: object[]) {
    const errorInfo = {
      message: 'Bad request',
      httpCode: 400,
      description: 'Invalid request',
      error: null,
      ...errorObj,
    };
    super(errorInfo);
    this.name = this.constructor.name;
    this.fields = fields;
    if (errorInfo.error) {
      this.stack = `${this.stack} \n${errorInfo.error.stack}`;
    }
  }

  toJSON() {
    return {
      httpCode: this.httpCode,
      message: this.message,
      description: this.description,
      errors: this.fields,
    };
  }
}
