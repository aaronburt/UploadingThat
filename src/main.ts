import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import disk from './model/diskStorage.js';
import authenticator from './controller/middleware.js';
import userRouter from './controller/api/v1/router/user.js';
import FILE from './controller/api/v1/file.js';
import env from './env.js';

const prisma = new PrismaClient();
const upload: multer.Multer = multer({ storage: disk });
const app: Express = express();

// Middleware setup
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/v1/user', userRouter);

app.get('/login', async (req: Request, res: Response) => res.render('login'));

app.get('/upload', authenticator, async (req: Request, res: Response) => {
    if (!req.user) return res.redirect('/login');
    return res.render('upload', { username: req.user.user.username });
});

app.get('/', authenticator, async (req: Request, res: Response) => {
    try {
        
        const files = await FILE.getFile(req.user.userId) as Array<{
            id: string;
            originalname: string;
            mimetype: string;
            size: number;
            userId: string | null;
        }>;
    
        return res.render('view', { file: files, username: req.user.user.username });
    
    } catch(error: any){
        console.warn(error);
        return res.sendStatus(500)
    }
});

app.get('/v/:id', async (req: Request, res: Response) => {
    try {
        const record = await prisma.file.findFirst({ where: { id: req.params.id } });
        if (!record) return res.sendStatus(400);

        const filePath = path.resolve(path.join(import.meta.dirname, '..', 'upload', record.id));
        if (!fs.existsSync(filePath)) return res.sendStatus(400);

        return res.sendFile(filePath);
    } catch (error) {
        console.warn(error);
        return res.sendStatus(500);
    }
});

app.post('/upload', authenticator, upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) return res.sendStatus(400);

        const { filename, originalname, mimetype, size } = req.file;
        const newFile = await prisma.file.create({
            data: {
                id: filename,
                originalname,
                mimetype,
                size,
                userId: req.user.userId
            }
        });

        return res.json(newFile);
    } catch (error) {
        console.warn(error);
        return res.sendStatus(500);
    }
});

app.listen(env.SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${env.SERVER_PORT}/`);
});
