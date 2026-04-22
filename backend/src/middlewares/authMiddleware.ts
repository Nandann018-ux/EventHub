import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';


export interface AuthRequest extends Request {
  userId?: string;
}


export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }

  req.userId = decoded.userId;
  next();
};
