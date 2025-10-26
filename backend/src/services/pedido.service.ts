import prisma from '../config/database';
import { CreatePedidoDTO, UpdatePedidoDTO } from '../types';
import { AppError } from '../middlewares/error.middleware';
import { CargoEnum, User, StatusPedidoEnum, PrioridadeEnum } from '@prisma/client';
import { logAtividade } from '../utils/logger';

export class PedidoService {
  static async create(userId: number, data: CreatePedidoDTO) {
    const pedido = await prisma.pedido.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        prioridade: data.prioridade as PrioridadeEnum,
        prazo: data.prazo ? new Date(data.prazo) : null,
        numero_processo: data.numero_processo,
        criado_por_id: userId,
      },
      include: {
        criado_por: true,
        atribuicoes: {
          include: {
            user: true,
          },
        },
      },
    });

    // Log da atividade
    await logAtividade(
      userId,
      'CRIACAO',
      `Pedido "${pedido.titulo}" criado`,
      pedido.id
    );

    // Se houver responsável, criar atribuição
    if (data.responsavel_id) {
      await prisma.atribuicao.create({
        data: {
          pedido_id: pedido.id,
          user_id: data.responsavel_id,
          cargo_responsavel: 'TECNICO',
        },
      });

      await logAtividade(
        userId,
        'ATRIBUICAO',
        `Pedido atribuído`,
        pedido.id,
        { responsavel_id: data.responsavel_id }
      );
    }

    return pedido;
  }

  static async list(user: User, filters?: any) {
    const where: any = {};

    // Filtrar por status
    if (filters?.status) {
      where.status = filters.status;
    }

    // Filtrar por prioridade
    if (filters?.prioridade) {
      where.prioridade = filters.prioridade;
    }

    // Aplicar regras de acesso baseadas no cargo
    if (user.cargo === 'TECNICO') {
      // Técnicos veem apenas pedidos atribuídos ou criados por eles
      where.OR = [
        { criado_por_id: user.id },
        { atribuicoes: { some: { user_id: user.id } } },
      ];
    } else if (user.cargo === 'CHEFE_DIVISAO') {
      // Chefes veem pedidos do setor
      if (user.setor) {
        where.OR = [
          { criado_por: { setor: user.setor } },
          { atribuicoes: { some: { user: { setor: user.setor } } } },
        ];
      }
    }
    // Diretores e Vice-diretores veem todos

    const pedidos = await prisma.pedido.findMany({
      where,
      include: {
        criado_por: true,
        atribuicoes: {
          include: {
            user: true,
          },
        },
        documentos: true,
        _count: {
          select: {
            comentarios: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return pedidos;
  }

  static async getById(id: number) {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        criado_por: true,
        atribuicoes: {
          include: {
            user: true,
          },
        },
        documentos: true,
        comentarios: {
          include: {
            user: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        logs_atividade: {
          include: {
            user: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 20,
        },
      },
    });

    if (!pedido) {
      throw new AppError('Pedido não encontrado', 404);
    }

    return pedido;
  }

  static async update(id: number, userId: number, data: UpdatePedidoDTO) {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedido) {
      throw new AppError('Pedido não encontrado', 404);
    }

    const updatedPedido = await prisma.pedido.update({
      where: { id },
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        status: data.status as StatusPedidoEnum,
        prioridade: data.prioridade as PrioridadeEnum,
        prazo: data.prazo ? new Date(data.prazo) : undefined,
        numero_processo: data.numero_processo,
      },
      include: {
        criado_por: true,
        atribuicoes: {
          include: {
            user: true,
          },
        },
      },
    });

    // Log da atividade
    await logAtividade(
      userId,
      'ATUALIZACAO',
      `Pedido "${updatedPedido.titulo}" atualizado`,
      id,
      { changes: data }
    );

    return updatedPedido;
  }

  static async delete(id: number, userId: number) {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedido) {
      throw new AppError('Pedido não encontrado', 404);
    }

    await prisma.pedido.delete({
      where: { id },
    });

    await logAtividade(
      userId,
      'ATUALIZACAO',
      `Pedido "${pedido.titulo}" excluído`,
      id
    );

    return { message: 'Pedido excluído com sucesso' };
  }

  static async addComentario(pedidoId: number, userId: number, conteudo: string) {
    const comentario = await prisma.comentario.create({
      data: {
        pedido_id: pedidoId,
        user_id: userId,
        conteudo,
      },
      include: {
        user: true,
      },
    });

    await logAtividade(
      userId,
      'COMENTARIO',
      'Comentário adicionado',
      pedidoId
    );

    return comentario;
  }

  static async getStatistics(user: User) {
    const where: any = {};

    // Aplicar filtros baseados no cargo
    if (user.cargo === 'TECNICO') {
      where.OR = [
        { criado_por_id: user.id },
        { atribuicoes: { some: { user_id: user.id } } },
      ];
    } else if (user.cargo === 'CHEFE_DIVISAO' && user.setor) {
      where.OR = [
        { criado_por: { setor: user.setor } },
        { atribuicoes: { some: { user: { setor: user.setor } } } },
      ];
    }

    const [total, pendentes, emExecucao, concluidos, urgentes] = await Promise.all([
      prisma.pedido.count({ where }),
      prisma.pedido.count({ where: { ...where, status: 'PENDENTE' } }),
      prisma.pedido.count({ where: { ...where, status: 'EM_EXECUCAO' } }),
      prisma.pedido.count({ where: { ...where, status: 'CONCLUIDO' } }),
      prisma.pedido.count({ where: { ...where, prioridade: 'URGENTE' } }),
    ]);

    const porStatus = await prisma.pedido.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    return {
      total,
      pendentes,
      emExecucao,
      concluidos,
      urgentes,
      porStatus: porStatus.map(item => ({
        status: item.status,
        count: item._count,
      })),
    };
  }
}
