import { Router } from 'express';
import authRoutes from './auth.routes';
import pedidoRoutes from './pedido.routes';
import userRoutes from './user.routes';
import atividadeRoutes from './atividade.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/users', userRoutes);
router.use('/atividades', atividadeRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
