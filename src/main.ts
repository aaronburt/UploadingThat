import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';

import multer from 'multer';
import path from 'path';
import fs from 'fs';

import disk from './model/diskStorage.js';
import authenticator from './controller/middleware.js';
import userRouter from './controller/api/v1/user.js';

const prisma = new PrismaClient();
const upload: multer.Multer = multer({ storage: disk });
const app: Express = express();

app.use(cookieParser());
app.use(express.json());
app.use('/api/v1/user', userRouter);

app.get('/', authenticator, async(req: Request, res: Response) => {
    return res.sendStatus(200);
});

app.get('/v/:id', async(req: Request, res: Response) => {
    try {
        const record = await prisma.file.findFirst({ where: { id: req.params.id } })

        if(record){
            const file = path.resolve(path.join(import.meta.dirname, '..', 'upload', record.id));
            if(fs.existsSync(file)){
                return res.sendFile(file);
            }
        }
    
        return res.sendStatus(400);
    } catch(error: any){
        console.warn(error);
        return res.sendStatus(500);
    }
});

// TODO add userId to upload so its tracked.
app.post('/upload', authenticator, upload.single('file'), async(req: Request, res: Response) => {
    try {
        if(req.file){

            const { filename, originalname, mimetype, size } = req.file;


            const file = await prisma.file.create({
                data: {
                    id: filename,
                    originalname: originalname,
                    mimetype: mimetype,
                    size: size,            
                }
            });

            return res.json(file);
        }
    
        return res.sendStatus(400);
    } catch(error: any){
        console.warn(error);
        return res.sendStatus(500);
    }
});

const server = app.listen(80, () => {
    console.log(`Server running at http://localhost:${80}/`);
});

const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
};
  
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);