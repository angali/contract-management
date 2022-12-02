import express from 'express'
const eventRouter = express.Router();

// controllers
import {
    requireSignin,
    authMiddleware,
    adminMiddleware,
} from '../controllers/auth';
import { list, create, terminate } from '../controllers/event';

// validators
import { runValidation } from '../validators';
import {
    eventListValidator,
    eventCreateValidator,
    eventTerminateValidator
} from '../validators/event';

// routes
eventRouter.get('/events', eventListValidator, runValidation, requireSignin, adminMiddleware, list);
eventRouter.post('/event/create', eventCreateValidator, runValidation, requireSignin, adminMiddleware, create);
eventRouter.post('/event/terminate', eventTerminateValidator, runValidation, requireSignin, adminMiddleware, terminate);

export default eventRouter;

