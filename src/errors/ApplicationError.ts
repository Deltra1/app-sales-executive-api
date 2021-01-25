import { HttpError } from 'routing-controllers';
export default class ApplicationError extends HttpError {
  public httpCode: number;
  public description: string;
  public message: string;

  constructor(errorObj: App.ErrorObj, ...params: any) {
    const errorData = {
      httpCode: 500,
      message: 'Somthing went wrong',
      description: 'Unexpected error occured in our system',
      ...errorObj,
    };

    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(errorData.httpCode, ...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError);
    }

    this.name = this.constructor.name;
    this.httpCode = errorData.httpCode;
    this.description = errorData.description;
    this.message = errorData.message;
  }

  toJSON() {
    return { httpCode: this.httpCode, message: this.message };
  }
}
