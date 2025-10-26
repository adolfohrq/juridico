import prisma from '../config/database';
import { User } from '@prisma/client';

export class AtividadeService {
  static async list(user: User, filters?: { pedidoId?: number; userId?: number }) {
    const where: any = {};

    if (filters?.pedidoId) {
      where.pedido_id = filters.pedidoId;
    }

    if (filters?.userId) {
      where.user_id = filters.userId;
    }

    // Aplicar regras de acesso baseadas no cargo
    if (user.cargo === 'TECNICO') {
      // Técnicos veem apenas atividades de pedidos atribuídos ou criados por eles
      where.OR = [
        { user_id: user.id },
        {
          pedido: {
            OR: [
              { criado_por_id: user.id },
              { atribuicoes: { some: { user_id: user.id } } },
            ],
          },
        },
      ];
    } else if (user.cargo === 'CHEFE_DIVISAO' && user.setor) {
      // Chefes veem atividades do setor
      where.OR = [
        { user: { setor: user.setor } },
        {
          pedido: {
            OR: [
              { criado_por: { setor: user.setor } },
              { atribuicoes: { some: { user: { setor: user.setor } } } },
            ],
          },
        },
      ];
    }
    // Diretores e Vice-diretores veem todas

    const atividades = await prisma.logAtividade.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            cargo: true,
            avatar_url: true,
          },
        },
        pedido: {
          select: {
            id: true,
            titulo: true,
            status: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 100, // Limitar a 100 registros mais recentes
    });

    return atividades;
  }

  static async getRecent(user: User, limit: number = 10) {
    const where: any = {};

    // Aplicar regras de acesso
    if (user.cargo === 'TECNICO') {
      where.OR = [
        { user_id: user.id },
        {
          pedido: {
            OR: [
              { criado_por_id: user.id },
              { atribuicoes: { some: { user_id: user.id } } },
            ],
          },
        },
      ];
    } else if (user.cargo === 'CHEFE_DIVISAO' && user.setor) {
      where.user = { setor: user.setor };
    }

    const atividades = await prisma.logAtividade.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            cargo: true,
            avatar_url: true,
          },
        },
        pedido: {
          select: {
            id: true,
            titulo: true,
            status: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    });

    return atividades;
  }
}
