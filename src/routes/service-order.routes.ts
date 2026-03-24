import { Router } from 'express';
import { ServiceOrderController } from '../controller/ServiceOrderController';
import { verifyJWT } from '../../config/middleware/jwtDecoder';

export const serviceOrderRouter = Router();
const controller = new ServiceOrderController();

// Rotas protegidas (com verificação JWT)
serviceOrderRouter.get('/', verifyJWT, (req, res) => controller.getAll(req, res));
serviceOrderRouter.get('/filter', verifyJWT, (req, res) => controller.filter(req, res));
// serviceOrderRouter.get('/list', verifyJWT, (req, res) => controller.getFilteredList(req, res));
serviceOrderRouter.get('/:id', verifyJWT, (req, res) => controller.getById(req, res));
serviceOrderRouter.post('/', verifyJWT, (req, res) => controller.create(req, res));
serviceOrderRouter.put('/:id', verifyJWT, (req, res) => controller.update(req, res));
serviceOrderRouter.delete('/:id', verifyJWT, (req, res) => controller.delete(req, res));
