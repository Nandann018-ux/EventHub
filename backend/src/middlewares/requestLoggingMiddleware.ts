import { Request, Response, NextFunction } from 'express';

export const requestLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} [${duration}ms]`);
  });

  next();
};
