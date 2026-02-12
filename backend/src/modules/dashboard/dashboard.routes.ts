import { Router } from 'express';
import { getDashboardStats } from './dashboard.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Assuming we want this protected
router.get('/stats', authMiddleware, getDashboardStats);

export default router;
