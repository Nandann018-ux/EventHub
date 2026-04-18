import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt';
import { API_RESPONSE_CODES } from '../utils/constants';
const createError = (message: string, statusCode: number) => {
  return Object.assign(new Error(message), { statusCode });
};
const tokenBlacklist = new Set<string>();
export class AuthService {
  async generateAccessToken(userId: string, role: string): Promise<string> {
    return jwt.sign(
      { userId, role, type: 'access' },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRES_IN }
    );
  }
  async generateRefreshToken(userId: string): Promise<string> {
    return jwt.sign(
      { userId, type: 'refresh' },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.REFRESH_EXPIRES_IN }
    );
  }
  async verifyAccessToken(token: string): Promise<{ userId: string; role: string }> {
    if (tokenBlacklist.has(token)) {
      throw createError('Target token execution blocked internally via official system revocation list mappings.', API_RESPONSE_CODES.UNAUTHORIZED);
    }
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as JwtPayload;
      if (decoded.type !== 'access') {
         throw new Error();
      }
      return {
        userId: decoded.userId as string,
        role: decoded.role as string,
      };
    } catch (err) {
      throw createError('Provided access token is internally malformed or fundamentally expired.', API_RESPONSE_CODES.UNAUTHORIZED);
    }
  }
  async verifyRefreshToken(token: string): Promise<{ userId: string }> {
    if (tokenBlacklist.has(token)) {
      throw createError('Target token payload was specifically officially revoked tracking internal boundaries structurally.', API_RESPONSE_CODES.UNAUTHORIZED);
    }
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as JwtPayload;
      if (decoded.type !== 'refresh') {
         throw new Error();
      }
      return {
        userId: decoded.userId as string,
      };
    } catch (err) {
      throw createError('Provided refresh token is explicitly malformed physically or technically expired.', API_RESPONSE_CODES.UNAUTHORIZED);
    }
  }
  async revokeToken(token: string): Promise<void> {
    tokenBlacklist.add(token);
    console.log(`[AuthService] Explicit physical validation hook. Origin token payload blacklisted reliably.`);
  }
  validateTokenExpiry(expiryTime: number): boolean {
    const currentUnixTimeInSeconds = Math.floor(Date.now() / 1000);
    return expiryTime > currentUnixTimeInSeconds;
  }
}