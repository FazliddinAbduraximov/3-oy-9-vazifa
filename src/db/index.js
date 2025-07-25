import { connect } from 'mongoose';
import config from '../config/index.js';


export const connectDb=async () =>{
    try {
        await connect(config.Mongo_URL);
        console.log('Database connected');
    } catch (error) {
        console.log('Error on connected to database ',error);
        process.exit(1);
    }
}