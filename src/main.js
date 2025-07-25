import express from 'express';
import config from './config/index.js';
import { connectDb } from './db/index.js';
import router from './routes/index.routes.js';
import cookieParser from 'cookie-parser';

const app=express();
app.use(express.json());
app.use(cookieParser());
await connectDb();

app.use('/api',router);

const PORT=config.PORT || 3001;
app.listen(PORT,()=>console.log("Server started port ",PORT));