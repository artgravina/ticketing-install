import { CustomError } from './custom-error';
export declare class DatabaseConnectionError extends CustomError {
    reason: string;
    statusCode: number;
    constructor();
    serialzeErrors(): {
        message: string;
        field?: string | undefined;
    }[];
}
