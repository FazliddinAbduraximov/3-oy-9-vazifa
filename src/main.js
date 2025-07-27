import express from 'express';
import config from './config/index.js';
import { connectDb } from './db/index.js';
import router from './routes/index.routes.js';
import cookieParser from 'cookie-parser';
import { globalErrorHandle } from './error/global-error-hendle.js';
import { pageError } from './error/page-not-found.error.js';
import helmet from 'helmet';

const app=express();
const PORT=config.PORT || 3001;

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

await connectDb();

app.use('/api',router);
app.use(pageError);

app.use(globalErrorHandle);

app.listen(PORT,()=>console.log("Server started port ",PORT));