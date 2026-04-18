import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();
const userController = new UserController();

// ==========================================
// Public Authentication Boundaries
// ==========================================
router.post('/register', userController.register);
router.post('/login', userController.login);

// ==========================================
// Protected User Boundaries
// ==========================================
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/logout', authenticate, userController.logout);

// ==========================================
// Administrative Boundaries
// ==========================================
router.get('/', authenticate, requireAdmin, userController.getAllUsers);
router.get('/:id', authenticate, requireAdmin, userController.getUserById);

export default router;
