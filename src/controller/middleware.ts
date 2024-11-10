import { Request, Response, NextFunction } from 'express';
import UTILITY from './utility.js';
import IDENTITY from './identity.js';

type middleware = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;

declare global {
    namespace Express {
        interface Request {
            user: {
                user: {
                    id: string;
                    username: string;
                    password: string;
                };
                id: string;
                userId: string;
            }
        }
    }   
}
  
const authenticator: middleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies['token'];
        
        if (!UTILITY.isString(token)) {
            return res.redirect('/login');
        }

        const user = await IDENTITY.verifyBearer(token);
        
        if (!user) {
            res.clearCookie('token');
            return res.redirect('/login');
        }

        req.user = user;
        return next();
        
    } catch (error) {
        console.warn('Authentication middleware error:', error);
        return res.sendStatus(500);
    }
}

export default authenticator;
