import { Router } from 'express';
import { NotificationController } from '../controller/NotificationController';
import { verifyJWT } from '../../config/middleware/jwtDecoder';

export const notificationRouter = Router();
const controller = new NotificationController();

notificationRouter.get('/', verifyJWT, (req, res) => controller.getAll(req, res));
notificationRouter.post('/', verifyJWT, (req, res) => controller.create(req, res));
notificationRouter.patch('/:id', verifyJWT, (req, res) => controller.markAsDone(req, res));
notificationRouter.delete('/:id', verifyJWT, (req, res) => controller.delete(req, res));
