import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AuthRequest } from '../types';

export class UserController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await UserService.list();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const user = await UserService.getById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const user = await UserService.update(id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await UserService.delete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      const { currentPassword, newPassword } = req.body;
      const result = await UserService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
