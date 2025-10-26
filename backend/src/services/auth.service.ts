import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { LoginDTO, RegisterDTO, TokenResponse, JWTPayload } from '../types';
import { AppError } from '../middlewares/error.middleware';
import { User } from '@prisma/client';

export class AuthService {
  private static generateTokens(user: User) {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      cargo: user.cargo,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  private static formatUserResponse(user: User): TokenResponse['user'] {
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      cargo: user.cargo,
      setor: user.setor || undefined,
      ativo: user.ativo,
      avatar_url: user.avatar_url || undefined,
    };
  }

  static async register(data: RegisterDTO): Promise<TokenResponse> {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email já cadastrado', 400);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        full_name: data.full_name,
        cargo: data.cargo,
        setor: data.setor,
        ativo: true,
      },
    });

    // Gerar tokens
    const tokens = this.generateTokens(user);

    // Salvar refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: tokens.refreshToken },
    });

    return {
      ...tokens,
      user: this.formatUserResponse(user),
    };
  }

  static async login(data: LoginDTO): Promise<TokenResponse> {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    if (!user.ativo) {
      throw new AppError('Usuário inativo', 401);
    }

    // Verificar se tem senha (usuários do Google não têm)
    if (!user.password) {
      throw new AppError('Use o login com Google para esta conta', 401);
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    // Gerar tokens
    const tokens = this.generateTokens(user);

    // Salvar refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: tokens.refreshToken },
    });

    return {
      ...tokens,
      user: this.formatUserResponse(user),
    };
  }

  static async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
      ) as JWTPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.ativo || user.refresh_token !== refreshToken) {
        throw new AppError('Refresh token inválido', 401);
      }

      // Gerar novos tokens
      const tokens = this.generateTokens(user);

      // Atualizar refresh token
      await prisma.user.update({
        where: { id: user.id },
        data: { refresh_token: tokens.refreshToken },
      });

      return {
        ...tokens,
        user: this.formatUserResponse(user),
      };
    } catch (error) {
      throw new AppError('Refresh token inválido ou expirado', 401);
    }
  }

  static async logout(userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refresh_token: null },
    });
  }

  static async googleLogin(user: User): Promise<TokenResponse> {
    if (!user.ativo) {
      throw new AppError('Usuário inativo', 401);
    }

    // Gerar tokens
    const tokens = this.generateTokens(user);

    // Salvar refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: tokens.refreshToken },
    });

    return {
      ...tokens,
      user: this.formatUserResponse(user),
    };
  }
}
