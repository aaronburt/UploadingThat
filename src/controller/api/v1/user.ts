import express, {  NextFunction, Request, Response } from "express";
import IDENTITY from "../../identity.js";

import { PrismaClient } from "@prisma/client";
import UTILITY from "../../utility.js";

const prisma = new PrismaClient()
const userRouter = express.Router();

userRouter.post('/create', async(req: Request, res: Response, next: NextFunction) => { 
    try {
        const { username, password } = req.body;

        if(UTILITY.isString(username) && UTILITY.isString(password)){
            const createdUser = await IDENTITY.createUser(req.body.username, req.body.password);
            if(UTILITY.isValidUserWithoutPassword(createdUser)){
                return res.status(201).json(createdUser)
            }
        }

        return res.sendStatus(400);
    } catch(error: any){
        console.warn(error);
        return res.sendStatus(500);
    }
});


userRouter.get('/list', async(req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany(
            {
                select: {
                    id: true,
                    username: true,
                },
            }
        )
    
        return res.json(users); 
    } catch(error: any){
        console.warn(error);
        return res.sendStatus(500);
    }
});

userRouter.get('/get/:id', async(req: Request, res: Response) => {
    try {
        const user = await IDENTITY.getUser(req.params.id);
        if(user !== null){
            return res.json(user);
        }
    
        return res.sendStatus(400)
    } catch(error: any){
        console.warn(error);
        return res.sendStatus(500);
    }
});

export default userRouter;