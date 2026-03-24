import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { verifyJWT } from '../../config/middleware/jwtDecoder';

export const userRouter = Router();
const controller = new UserController();

// Rotas públicas (sem proteção JWT)
userRouter.get('/login', (req, res) => controller.login(req, res));
userRouter.post('/', (req, res) => controller.create(req, res));

// Rotas protegidas (com verificação JWT)
userRouter.get('/', verifyJWT, (req, res) => controller.getAll(req, res));
userRouter.get('/search', verifyJWT, (req, res) => controller.search(req, res));
userRouter.get('/:id', verifyJWT, (req, res) => controller.getById(req, res));
userRouter.put('/:id', verifyJWT, (req, res) => controller.update(req, res));
userRouter.delete('/:id', verifyJWT, (req, res) => controller.delete(req, res));
