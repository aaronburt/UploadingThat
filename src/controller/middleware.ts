import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import UTILITY from './utility.js';
import IDENTITY from './identity.js';

type middleware = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;


// TODO pass req.user down the chain to keep userId, username and bearer in memory
const authenticator: middleware = async(req: Request, res: Response, next: NextFunction) => {

    const tokenBearer = req.cookies['token'];
    if(UTILITY.isString(tokenBearer)){
        if(await IDENTITY.verifyBearer(tokenBearer)){
            return next();
        }
    }

    return res.sendStatus(401);
}





export default authenticator;