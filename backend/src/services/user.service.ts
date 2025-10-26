import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { CargoEnum } from '@prisma/client';

export class UserService {
  static async list() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        full_name: true,
        cargo: true,
        setor: true,
        ativo: true,
        avatar_url: true,
        created_at: true,
        _count: {
          select: {
            pedidos_criados: true,
            atribuicoes: true,
          },
        },
      },
      orderBy: {
        full_name: 'asc',
      },
    });

    return users;
  }

  static async getById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        cargo: true,
        setor: true,
        ativo: true,
        avatar_url: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            pedidos_criados: true,
            atribuicoes: true,
            logs_atividade: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return user;
  }

  static async create(data: {
    email: string;
    password: string;
    full_name: string;
    cargo: CargoEnum;
    setor?: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email já cadastrado', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        full_name: data.full_name,
        cargo: data.cargo,
        setor: data.setor,
        ativo: true,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        cargo: true,
        setor: true,
        ativo: true,
        created_at: true,
      },
    });

    return user;
  }

  static async update(
    id: number,
    data: {
      full_name?: string;
      cargo?: CargoEnum;
      setor?: string;
      ativo?: boolean;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        full_name: true,
        cargo: true,
        setor: true,
        ativo: true,
        avatar_url: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  static async delete(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        pedidos_criados: true,
        atribuicoes: true,
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Verificar se tem pedidos ou atribuições
    if (user.pedidos_criados.length > 0 || user.atribuicoes.length > 0) {
      // Desativar ao invés de deletar
      await prisma.user.update({
        where: { id },
        data: { ativo: false },
      });

      return { message: 'Usuário desativado (possui vínculos com pedidos)' };
    }

    await prisma.user.delete({
      where: { id },
    });

    return { message: 'Usuário excluído com sucesso' };
  }

  static async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new AppError('Usuário não encontrado ou sem senha definida', 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError('Senha atual incorreta', 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Senha alterada com sucesso' };
  }
}
