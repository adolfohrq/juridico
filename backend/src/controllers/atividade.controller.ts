import { Response, NextFunction } from 'express';
import { AtividadeService } from '../services/atividade.service';
import { AuthRequest } from '../types';

export class AtividadeController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      const filters = {
        pedidoId: req.query.pedidoId ? parseInt(req.query.pedidoId as string) : undefined,
        userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
      };

      const atividades = await AtividadeService.list(req.user, filters);
      res.json(atividades);
    } catch (error) {
      next(error);
    }
  }

  static async getRecent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const atividades = await AtividadeService.getRecent(req.user, limit);
      res.json(atividades);
    } catch (error) {
      next(error);
    }
  }
}
