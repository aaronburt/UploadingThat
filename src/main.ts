import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import multer from 'multer';
import path from 'path';
import fs from 'fs';

import disk from './model/diskStorage.js';
import authenticator from './controller/middleware.js';

const upload: multer.Multer = multer({ storage: disk });
const app: Express = express();

const prisma = new PrismaClient();

app.get('/v/:id', async(req: Request, res: Response) => {
    try {
        const record = await prisma.file.findFirst({ where: { id: req.params.id } })

        if(record){
            const file = path.resolve(path.join(import.meta.dirname, '..', 'upload', record.id));
            if(fs.existsSync(file)){
                return res.sendFile(file);
            }
        }
    
        return res.sendStatus(400)
    } catch(error: any){
        console.warn(error);
        return res.sendStatus(500);
    }
});

app.post('/upload', authenticator, upload.single('file'), async(req: Request, res: Response) => {
    try {
        if(req.file){

            const { filename, originalname, mimetype, size } = req.file;
            const file = await prisma.file.create({
                data: {
                    id: filename,
                    originalname: originalname,
                    mimetype: mimetype,
                    size: size
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

app.listen(3000);