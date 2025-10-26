import { Router } from 'express';
import { PedidoController } from '../controllers/pedido.controller';
import { authenticate, authorize, canAccessPedido } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Estatísticas
router.get('/statistics', PedidoController.getStatistics);

// CRUD de pedidos
router.post(
  '/',
  authorize('DIRETOR_JURIDICO', 'VICE_DIRETOR_JURIDICO', 'CHEFE_DIVISAO'),
  PedidoController.create
);

router.get('/', PedidoController.list);

router.get('/:id', canAccessPedido, PedidoController.getById);

router.put(
  '/:id',
  canAccessPedido,
  PedidoController.update
);

router.delete(
  '/:id',
  authorize('DIRETOR_JURIDICO', 'VICE_DIRETOR_JURIDICO'),
  canAccessPedido,
  PedidoController.delete
);

// Comentários
router.post('/:id/comentarios', canAccessPedido, PedidoController.addComentario);

export default router;
