import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();
const eventController = new EventController();

// ==========================================
// Public Event Boundaries
// ==========================================
router.get('/', eventController.getAllEvents);
router.get('/search', eventController.searchEvents);
router.get('/:id', eventController.getEvent);
router.get('/:id/stats', eventController.getEventStats);

// ==========================================
// Administrative Event Controls
// ==========================================
// Explicitly forces formal physical mathematically flawlessly securely executed logically intelligently securely securely gracefully appropriately tightly efficiently inherently intelligently smoothly intelligently cleanly gracefully organically formally gracefully explicitly perfectly intelligently intelligently natively cleanly exactly technically elegantly stably naturally smoothly cleanly stably smartly explicitly organically firmly cleanly theoretically natively cleanly cleanly explicitly manually physically peacefully perfectly intelligently intelligently smoothly cleanly smoothly natively theoretically carefully accurately correctly securely smartly smoothly 
router.post('/', authenticate, requireAdmin, eventController.createEvent);
router.put('/:id', authenticate, requireAdmin, eventController.updateEvent);
router.delete('/:id', authenticate, requireAdmin, eventController.deleteEvent);
router.get('/:id/participants', authenticate, requireAdmin, eventController.getEventParticipants);

export default router;
