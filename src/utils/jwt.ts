import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt';

/**
 * Generates a signed JSON Web Token
 * @param payload Object payload to encrypt
 * @param expiresIn Time string (e.g., '1d', '2h')
 */
export const generateToken = (
  payload: string | object | Buffer,
  expiresIn: string | number = JWT_CONFIG.EXPIRES_IN
): string => {
  return jwt.sign(payload, JWT_CONFIG.SECRET, { expiresIn });
};

/**
 * Decodes and verifies a JWT token
 * @param token The JWT string
 */
export const verifyToken = <T>(token: string): T => {
  try {
    return jwt.verify(token, JWT_CONFIG.SECRET) as T;
  } catch (error) {
    throw new Error('Token is invalid or expired.');
  }
};

/**
 * Safely extracts a userId from a raw JWT token, suppressing errors if formatting is invalid
 * @param token The JWT string
 */
export const extractUserId = (token: string): string | null => {
  try {
    const decoded = verifyToken<{ id: string }>(token);
    return decoded?.id || null;
  } catch (error) {
    return null; // Return null predictably if extraction fails
  }
};
