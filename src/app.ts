import express, { Application } from 'express';
import cors from 'cors';
import { router } from './routes';
import { jwtDecoder } from '../config/middleware/jwtDecoder';

export function createApp(): Application {
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }));

  // Debug middleware to log all requests
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // JWT middleware
  app.use(jwtDecoder);

  // Health check route
  app.get('/', (req, res) => {
    res.json({
      message: 'API is running',
      version: '1.0.0',
      endpoints: {
        ping: '/api/ping'
      }
    });
  });

  // API routes
  app.use('/api', router);

  // 404 handler
  app.use((req, res) => {
    console.log('404 - Route not found:', req.method, req.path);
    res.status(404).json({
      message: 'Route not found',
      method: req.method,
      path: req.path
    });
  });

  return app;
}
