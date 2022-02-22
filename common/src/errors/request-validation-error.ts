import { CustomError } from './custom-error';
import { ValidationError } from 'express-validator';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  // following defines this.errors
  constructor(public errors: ValidationError[]) {
    super('invalid request parameters');

    // only becuase of typescript
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialzeErrors(): { message: string; field?: string | undefined }[] {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
