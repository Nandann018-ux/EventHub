import { Request, Response, NextFunction } from 'express';
import { API_RESPONSE_CODES } from '../utils/constants';

interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitData>();

// 100 requests per 1 hour window
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 100;

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  const windowData = rateLimitStore.get(ip);

  if (!windowData) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  // If the window has passed, reset
  if (now > windowData.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  // Increment the request count
  windowData.count++;

  if (windowData.count > MAX_REQUESTS) {
    const error = new Error('Too many requests, please try again later.');
    error.name = 'RateLimitError';
    (error as any).statusCode = 429;
    return next(error);
  }

  next();
};

// Cleanup routine to prevent memory leaks in the map (runs every hour)
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, WINDOW_MS);
