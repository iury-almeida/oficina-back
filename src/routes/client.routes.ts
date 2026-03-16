import { Router } from 'express';
import { ClientController } from '../controller/ClientController';
import { verifyJWT } from '../../config/middleware/jwtDecoder';

export const clientRouter = Router();
const controller = new ClientController();

// Rotas protegidas (com verificação JWT)
clientRouter.get('/', verifyJWT, (req, res) => controller.getAll(req, res));
clientRouter.get('/dropdown', verifyJWT, (req, res) => controller.dropdown(req, res));
clientRouter.get('/search', verifyJWT, (req, res) => controller.search(req, res));
clientRouter.get('/:id', verifyJWT, (req, res) => controller.getById(req, res));
clientRouter.post('/', verifyJWT, (req, res) => controller.create(req, res));
clientRouter.put('/:id', verifyJWT, (req, res) => controller.update(req, res));
clientRouter.delete('/:id', verifyJWT, (req, res) => controller.delete(req, res));
