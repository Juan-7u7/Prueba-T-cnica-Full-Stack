import { Router } from 'express';
import authRoutes from './auth.routes';
import recordRoutes from './record.routes';

const router = Router();

// Comprobación de estado (Health check)
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoints de autenticación
router.use('/auth', authRoutes);

// Endpoints de registros
router.use('/records', recordRoutes);

export default router;
