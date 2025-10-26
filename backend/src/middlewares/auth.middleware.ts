import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JWTPayload } from '../types';
import prisma from '../config/database';
import { CargoEnum } from '@prisma/client';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Token não fornecido' });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.ativo) {
      res.status(401).json({ error: 'Usuário não autenticado ou inativo' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export const authorize = (...allowedRoles: CargoEnum[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.cargo)) {
      res.status(403).json({
        error: 'Acesso negado',
        message: `Cargo ${req.user.cargo} não tem permissão para esta ação`,
      });
      return;
    }

    next();
  };
};

// Middleware para verificar se o usuário pode acessar um pedido específico
export const canAccessPedido = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    const pedidoId = parseInt(req.params.id);
    const user = req.user;

    // Diretores e Vice-diretores podem acessar todos os pedidos
    if (
      user.cargo === 'DIRETOR_JURIDICO' ||
      user.cargo === 'VICE_DIRETOR_JURIDICO'
    ) {
      next();
      return;
    }

    // Verificar se o pedido existe
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        atribuicoes: true,
        criado_por: true,
      },
    });

    if (!pedido) {
      res.status(404).json({ error: 'Pedido não encontrado' });
      return;
    }

    // Criador pode acessar
    if (pedido.criado_por_id === user.id) {
      next();
      return;
    }

    // Verificar se o usuário está atribuído ao pedido
    const isAssigned = pedido.atribuicoes.some(
      (atribuicao) => atribuicao.user_id === user.id
    );

    if (isAssigned) {
      next();
      return;
    }

    // Se chegou aqui, não tem acesso
    res.status(403).json({
      error: 'Acesso negado',
      message: 'Você não tem permissão para acessar este pedido',
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar permissões' });
  }
};
