import api from '../services/api';

export class LogAtividade {
  static async list(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.pedidoId) params.append('pedidoId', filters.pedidoId);
      if (filters.userId) params.append('userId', filters.userId);

      const response = await api.get(`/atividades?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar atividades:', error);
      throw error;
    }
  }

  static async getRecent(limit = 10) {
    try {
      const response = await api.get(`/atividades/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      throw error;
    }
  }

  static async create(logData) {
    // Logs são criados automaticamente pelo backend
    // Este método mantido para compatibilidade, mas não faz nada
    console.warn('LogAtividade.create() não é mais necessário - logs são automáticos');
    return logData;
  }
}
