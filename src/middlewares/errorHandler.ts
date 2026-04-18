import { Request, Response, NextFunction } from 'express';
import { API_RESPONSE_CODES } from '../utils/constants';

/**
 * Global Error Handler middleware for Express
 * Catches errors, logs them, and returns a formatted JSON response.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Log the error to console
  console.error(`[Error] - ${req.method} ${req.path}:`, err.message || err);
  if (process.env.NODE_ENV === 'development' && err.stack) {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  // Standardized error response
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
