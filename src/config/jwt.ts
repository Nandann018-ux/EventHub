import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
}

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET as string,
  EXPIRES_IN: '1d',        // Default access token expiration
  REFRESH_EXPIRES_IN: '7d', // Default refresh token expiration
};
