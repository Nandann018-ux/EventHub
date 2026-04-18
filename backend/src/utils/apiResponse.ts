import { Response } from 'express';
import { API_RESPONSE_CODES } from './constants';
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  const status = statusCode >= 400 && statusCode < 600 ? 'error' : 'success';
  return res.status(statusCode).json({
    status,
    message,
    ...(data !== undefined && { data }),
  });
};
export const sendSuccess = <T>(res: Response, data?: T, message = 'Success') => {
  return sendResponse(res, API_RESPONSE_CODES.SUCCESS, message, data);
};
export const sendCreated = <T>(res: Response, data?: T, message = 'Resource Created Successfully') => {
  return sendResponse(res, API_RESPONSE_CODES.CREATED, message, data);
};
export const sendError = (res: Response, statusCode: number, message: string) => {
  return sendResponse(res, statusCode, message);
};