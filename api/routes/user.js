import express from 'express'
const userRouter = express.Router();

// controllers
import {
    requireSignin,
    authMiddleware,
    adminMiddleware
} from '../controllers/auth';
import { read } from '../controllers/user';

// validators
import { runValidation } from '../validators';

// routes
userRouter.get('/user', requireSignin, authMiddleware, read);
userRouter.get('/admin', requireSignin, adminMiddleware, read);


export default userRouter;

