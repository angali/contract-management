import express from "express";
import morgan from "morgan";
import bodyParser from 'body-parser';
import dotEnv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import authRouter from './routes/auth';
import userRouter from './routes/user';
import eventRouter from './routes/event';


dotEnv.config();
const app = express();

//connect to database
mongoose.connect(process.env.MONGO_URI, { useNewurlParser: true })
    .then(() => console.log('DB conneceted'))
    .catch((err) => console.log("DB Error:  ", err));

//midllewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({origin: process.env.CLIENT_URL}));


//routers
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', eventRouter);


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`API is running on port ${port}`)
});