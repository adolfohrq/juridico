import { Router } from 'express';
import { AtividadeController } from '../controllers/atividade.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

router.get('/', AtividadeController.list);
router.get('/recent', AtividadeController.getRecent);

export default router;
