import { Router } from 'express';
import { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent 
} from '../controllers/eventController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();


router.get('/', getAllEvents);
router.get('/:id', getEventById);


router.post('/', authMiddleware, createEvent);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

export default router;
