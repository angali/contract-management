import express from 'express'
const authRouter = express.Router();

// controllers
import {
    register,
    userLogin,
    userRegisterActivate,
    userForgotPassword,
    resetPassword,
} from '../controllers/auth';

// validators
import { runValidation } from '../validators'
import {
    userRegisterValidator,
    userRegisterActivateValidator,
    userLoginValidator,
    forgotPasswordValidator,
    resetPasswordValidator
} from '../validators/auth';

// routers
authRouter.post('/register', userRegisterValidator, runValidation, register);
authRouter.post('/register/activate', userRegisterActivateValidator, runValidation, userRegisterActivate);
authRouter.post('/login', userLoginValidator, runValidation, userLogin);
authRouter.post('/forgot-password', forgotPasswordValidator, runValidation, userForgotPassword);
authRouter.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);


export default authRouter;

