import { Router } from 'express';
import { getUsers, getUserById, updateUser, updateUserRole, updateUserStatus, deleteUser } from './users.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

export default router;

