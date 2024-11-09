import { Request } from 'express';
import multer from 'multer';

import path from 'path';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export type callback = (error: Error | null, destination: string) => void;

const disk: multer.StorageEngine = multer.diskStorage({
    "destination": (req: Request, file: Express.Multer.File, callback: callback) => {
        callback(null, "./upload");
    },

    "filename": async(req: Request, file: Express.Multer.File, callback: callback) => {
        const extname = path.extname(file.originalname);
        callback(null, `${crypto.randomUUID()}${extname}`);
    },
})


export default disk;