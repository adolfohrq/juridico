import { Request } from 'express';
import { User, CargoEnum } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User;
}

export interface JWTPayload {
  userId: number;
  email: string;
  cargo: CargoEnum;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  cargo: string;
  setor?: string;
  ativo: boolean;
  avatar_url?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  full_name: string;
  cargo: CargoEnum;
  setor?: string;
}

export interface CreatePedidoDTO {
  titulo: string;
  descricao: string;
  prioridade: string;
  prazo?: string;
  numero_processo?: string;
  responsavel_id?: number;
}

export interface UpdatePedidoDTO {
  titulo?: string;
  descricao?: string;
  status?: string;
  prioridade?: string;
  prazo?: string;
  numero_processo?: string;
}
