import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


const rawOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
// Ensure origin doesn't have a trailing slash or path (common mistake)
const allowedOrigin = rawOrigin.replace(/\/$/, '').split('/').slice(0, 3).join('/');

app.use(cors({
  origin: [allowedOrigin, 'http://localhost:5173'], // Allow both prod and dev origins
  credentials: true
}));
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'EventHub API is running' });
});


app.use((req, res, next) => {
  if (req.url.startsWith('/events') || req.url.startsWith('/auth')) {
    const newUrl = `/api${req.url}`;
    return res.redirect(307, newUrl); // Use 307 to preserve method (POST/PUT/etc)
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
