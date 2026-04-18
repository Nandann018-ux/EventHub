import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client initialization
 * Avoids instantiating multiple Prisma Client instances in development
 * due to Hot Module Replacement or similar fast-reload behaviors.
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // Configure pooling and logging
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
