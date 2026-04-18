import express, { Express } from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middlewares/corsMiddleware';
import { rateLimitMiddleware } from './middlewares/rateLimitMiddleware';
import { securityMiddleware } from './middlewares/securityMiddleware';
import { requestLoggingMiddleware } from './middlewares/requestLoggingMiddleware';
import prisma from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import registrationRoutes from './routes/registrationRoutes';
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(rateLimitMiddleware);
app.use(requestLoggingMiddleware);
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use(errorHandler);
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('[database]: Connected to Prisma client successfully.');
    const server = app.listen(port, () => {
      console.log(`[server]: Server running on port ${port}`);
    });
    process.on('SIGTERM', async () => {
      console.log('[server]: SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('[server]: HTTP server closed');
      });
      await prisma.$disconnect();
      console.log('[database]: Prisma client disconnected');
      process.exit(0);
    });
    process.on('SIGINT', async () => {
      console.log('[server]: SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('[server]: HTTP server closed');
      });
      await prisma.$disconnect();
      console.log('[database]: Prisma client disconnected');
      process.exit(0);
    });
  } catch (error) {
    console.error('[server]: Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};
startServer();