import { Router } from 'express';
import { MechanicController } from '../controller/MechanicController';
import { verifyJWT } from '../../config/middleware/jwtDecoder';

export const mechanicRouter = Router();
const controller = new MechanicController();

// Rotas protegidas (com verificação JWT)
mechanicRouter.get('/', verifyJWT, (req, res) => controller.getAll(req, res));
mechanicRouter.get('/search', verifyJWT, (req, res) => controller.search(req, res));
mechanicRouter.get('/:id', verifyJWT, (req, res) => controller.getById(req, res));
mechanicRouter.post('/', verifyJWT, (req, res) => controller.create(req, res));
mechanicRouter.put('/:id', verifyJWT, (req, res) => controller.update(req, res));
mechanicRouter.delete('/:id', verifyJWT, (req, res) => controller.delete(req, res));
