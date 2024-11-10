import express, {  NextFunction, Request, Response } from "express";
import IDENTITY from "../../identity.js";
import UTILITY from "../../utility.js";

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


userRouter.post('/authenticate', async(req: Request, res: Response) => { 
    try {

        const { username, password } = req.body;
        const user = await IDENTITY.checkUserPassword(username, password);

        if(UTILITY.isValidUserWithoutPassword(user)){
            const bearer = await IDENTITY.generateBearer(user.id);
            res.cookie("token", bearer.id);
            return res.json(bearer);
        }

        return res.sendStatus(400)

    } catch(error: any){
        console.warn(error);
        return res.sendStatus(500);
    }
})

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