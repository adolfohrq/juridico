import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../types';
import passport from 'passport';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('📨 Controller recebeu req.body:', JSON.stringify(req.body, null, 2));
      console.log('📨 Content-Type:', req.headers['content-type']);
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await AuthService.logout(req.user.id);
      }
      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Não autenticado' });
        return;
      }

      res.json({
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name,
        cargo: req.user.cargo,
        setor: req.user.setor,
        ativo: req.user.ativo,
        avatar_url: req.user.avatar_url,
      });
    } catch (error) {
      next(error);
    }
  }

  // Google OAuth
  static googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  });

  static googleCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { session: false }, async (err: any, user: any) => {
      try {
        if (err || !user) {
          return res.redirect(
            `${process.env.FRONTEND_URL || 'http://localhost:3005'}/?error=google_auth_failed`
          );
        }

        const result = await AuthService.googleLogin(user);

        // Redirecionar para o frontend com os tokens
        const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3005'}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
        res.redirect(redirectUrl);
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };
}
