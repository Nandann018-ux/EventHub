import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt';
import { API_RESPONSE_CODES } from '../utils/constants';

// Extend Express Request globally to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(API_RESPONSE_CODES.UNAUTHORIZED).json({
      status: 'fail',
      message: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(API_RESPONSE_CODES.UNAUTHORIZED).json({
      status: 'fail',
      message: 'Invalid or expired token.',
    });
  }
};
