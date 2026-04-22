import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: [
    'https://event-hub-beta-one.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5000'
  ],
  credentials: true
}));
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'EventHub API is running' });
});


app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.url.startsWith('/events') || req.url.startsWith('/auth')) {
    req.url = `/api${req.url}`;
  }
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});


app.listen(port, () => {
  console.log(`[server]: EventHub Backend is running at http://localhost:${port}`);
});

export default app;
