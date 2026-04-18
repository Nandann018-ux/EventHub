import { Request, Response, NextFunction } from 'express';

export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Prevent browsers from guessing the MIME type
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS filtering in legacy browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Protect against downgrade attacks
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Control information sharing
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Prevent caching of sensitive data, useful for API routes
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');

  next();
};
