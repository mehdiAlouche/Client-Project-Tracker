import { Router } from 'express';
import authRoutes from './auth/index.js';
import projectRoutes from './project/index.js';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;

