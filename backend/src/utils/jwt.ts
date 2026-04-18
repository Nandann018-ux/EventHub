import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt';
export const generateToken = (
  payload: string | object | Buffer,
  expiresIn: string | number = JWT_CONFIG.EXPIRES_IN
): string => {
  return jwt.sign(payload, JWT_CONFIG.SECRET, { expiresIn });
};
export const verifyToken = <T>(token: string): T => {
  try {
    return jwt.verify(token, JWT_CONFIG.SECRET) as T;
  } catch (error) {
    throw new Error('Token is invalid or expired.');
  }
};
export const extractUserId = (token: string): string | null => {
  try {
    const decoded = verifyToken<{ id: string }>(token);
    return decoded?.id || null;
  } catch (error) {
    return null;
  }
};