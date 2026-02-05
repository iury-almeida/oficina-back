import { Router } from 'express';
import { pingRouter } from './ping.routes';
import { userRouter } from './user.routes';

export const router = Router();

// Import your route files here
// router.use('/users', userRouter);

// Ping route (always available)
router.use('/ping', pingRouter);
router.use('/user', userRouter);

// 404 for undefined routes
router.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path
  });
});
