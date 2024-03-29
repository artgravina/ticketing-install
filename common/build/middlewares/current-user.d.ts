import { Request, Response, NextFunction } from 'express';
interface UserPayload {
    id: String;
    email: String;
}
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}
export declare const currentUser: (req: Request, res: Response, next: NextFunction) => void;
export {};
