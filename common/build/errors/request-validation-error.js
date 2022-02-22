"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const custom_error_1 = require("./custom-error");
class RequestValidationError extends custom_error_1.CustomError {
    // following defines this.errors
    constructor(errors) {
        super('invalid request parameters');
        this.errors = errors;
        this.statusCode = 400;
        // only becuase of typescript
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serialzeErrors() {
        return this.errors.map((err) => {
            return { message: err.msg, field: err.param };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
