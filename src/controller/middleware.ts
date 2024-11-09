import { Request, Response, NextFunction } from 'express';


type middleware = (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>; 

const authenticator: middleware = (req: Request, res: Response, next: NextFunction) => {

    if(req.headers.authorization){
        if(req.headers.authorization.startsWith('Bearer')){
            console.log(req.headers.authorization)
            return next();
        }
    }

    return res.sendStatus(401);
}

export default authenticator;