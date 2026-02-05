import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware que apenas decodifica o token se existir (não bloqueia)
export const jwtDecoder = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ JWT decode error:', error instanceof Error ? error.message : error);
    next();
  }
};

// Middleware que verifica e bloqueia sem token (para rotas protegidas)
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      message: 'No authorization token provided'
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Invalid authorization header format'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ JWT verification error:', error instanceof Error ? error.message : error);
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
};
