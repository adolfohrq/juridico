import prisma from '../config/database';
import { TipoAtividadeEnum } from '@prisma/client';

export const logAtividade = async (
  userId: number,
  tipo: TipoAtividadeEnum,
  descricao: string,
  pedidoId?: number,
  metadata?: any
) => {
  try {
    await prisma.logAtividade.create({
      data: {
        user_id: userId,
        pedido_id: pedidoId,
        tipo,
        descricao,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar log de atividade:', error);
  }
};
