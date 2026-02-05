import { Router } from 'express';

export const pingRouter = Router();

pingRouter.get('/', (req, res) => {
  res.json({
    message: 'Pong! 🏓',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
