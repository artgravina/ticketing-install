import { CustomError } from './custom-error';
export declare class BadRequestError extends CustomError {
    message: string;
    statusCode: number;
    constructor(message: string);
    serialzeErrors(): {
        message: string;
        field?: string | undefined;
    }[];
}
