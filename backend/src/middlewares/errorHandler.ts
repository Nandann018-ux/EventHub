import { Request, Response, NextFunction } from 'express';
import { API_RESPONSE_CODES } from '../utils/constants';
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] - ${req.method} ${req.path}:`, err.message || err);
  if (process.env.NODE_ENV === 'development' && err.stack) {
    console.error(err.stack);
  }
  let statusCode = err.statusCode || API_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  switch (err.name) {
    case 'ValidationError':
      statusCode = API_RESPONSE_CODES.BAD_REQUEST;
      break;
    case 'AuthenticationError':
      statusCode = API_RESPONSE_CODES.UNAUTHORIZED;
      break;
    case 'AuthorizationError':
      statusCode = API_RESPONSE_CODES.FORBIDDEN;
      break;
    case 'NotFoundError':
      statusCode = API_RESPONSE_CODES.NOT_FOUND;
      break;
    case 'ConflictError':
      statusCode = API_RESPONSE_CODES.CONFLICT;
      break;
    default:
      break;
  }
  return res.status(statusCode).json({
    success: false,
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};