import api from '../services/api';

export class User {
  static async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  }

  static async loginWithGoogle() {
    const googleAuthUrl = import.meta.env.VITE_GOOGLE_AUTH_URL || 'http://localhost:3000/api/auth/google';
    window.location.href = googleAuthUrl;
  }

  static async handleGoogleCallback(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    const user = await this.me();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  static async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  }

  static async me() {
    try {
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      const response = await api.get('/auth/me');
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  static async list() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar usuário');
    }
  }

  static async update(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar usuário');
    }
  }

  static async updateMyUserData(data) {
    try {
      const user = await this.me();
      const response = await api.put(`/users/${user.id}`, data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar usuário');
    }
  }

  static async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/users/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw new Error(error.response?.data?.error || 'Erro ao alterar senha');
    }
  }

  static isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  static getAccessToken() {
    return localStorage.getItem('accessToken');
  }
}
