import { CustomError } from './custom-error';
export declare class NotFoundError extends CustomError {
    statusCode: number;
    constructor();
    serialzeErrors(): {
        message: string;
        field?: string | undefined;
    }[];
}
