import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Alterar senha (próprio usuário)
router.post('/change-password', UserController.changePassword);

// Listar e visualizar usuários (todos podem ver)
router.get('/', UserController.list);
router.get('/:id', UserController.getById);

// Criar, editar e deletar (apenas diretores e vice-diretores)
router.post(
  '/',
  authorize('DIRETOR_JURIDICO', 'VICE_DIRETOR_JURIDICO'),
  UserController.create
);

router.put(
  '/:id',
  authorize('DIRETOR_JURIDICO', 'VICE_DIRETOR_JURIDICO'),
  UserController.update
);

router.delete(
  '/:id',
  authorize('DIRETOR_JURIDICO', 'VICE_DIRETOR_JURIDICO'),
  UserController.delete
);

export default router;
