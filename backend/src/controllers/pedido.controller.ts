import { Response, NextFunction } from 'express';
import { PedidoService } from '../services/pedido.service';
import { AuthRequest } from '../types';

export class PedidoController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      const pedido = await PedidoService.create(req.user.id, req.body);
      res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      const filters = {
        status: req.query.status as string,
        prioridade: req.query.prioridade as string,
      };

      const pedidos = await PedidoService.list(req.user, filters);
      res.json(pedidos);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const pedido = await PedidoService.getById(id);
      res.json(pedido);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      const id = parseInt(req.params.id);
      const pedido = await PedidoService.update(id, req.user.id, req.body);
      res.json(pedido);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      const id = parseInt(req.params.id);
      const result = await PedidoService.delete(id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async addComentario(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      const pedidoId = parseInt(req.params.id);
      const { conteudo } = req.body;

      const comentario = await PedidoService.addComentario(
        pedidoId,
        req.user.id,
        conteudo
      );
      res.status(201).json(comentario);
    } catch (error) {
      next(error);
    }
  }

  static async getStatistics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      const stats = await PedidoService.getStatistics(req.user);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
