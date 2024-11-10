import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

type middleware = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;



const authenticator: middleware = async(req: Request, res: Response, next: NextFunction) => {

    const prisma = new PrismaClient();

    if(req.headers.authorization){
        if(req.headers.authorization.startsWith('Bearer')){

            const token = req.headers.authorization.split(' ')[1];

            const tokenRecord = await prisma.bearer.findFirst({ 
                where: {
                    id: token
                }  
            });

            return next();
        }
    }

    return res.sendStatus(401);
}

export default authenticator;