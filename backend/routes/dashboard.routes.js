import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/dashboard
router.get('/', authenticateToken, getDashboardStats);

export default router;