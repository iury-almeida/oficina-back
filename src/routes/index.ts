import { Router } from 'express';
import { pingRouter } from './ping.routes';
import { userRouter } from './user.routes';
import { clientRouter } from './client.routes';
import { mechanicRouter } from './mechanic.routes';
import { serviceOrderRouter } from './service-order.routes';

export const router = Router();

// Import your route files here
// router.use('/users', userRouter);

// Ping route (always available)
router.use('/ping', pingRouter);
router.use('/user', userRouter);
router.use('/client', clientRouter);
router.use('/mechanic', mechanicRouter);
router.use('/service-order', serviceOrderRouter);

// 404 for undefined routes
router.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path
  });
});
