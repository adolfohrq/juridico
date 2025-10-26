import api from '../services/api';

export class Pedido {
  static async list(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.prioridade) params.append('prioridade', filters.prioridade);

      const response = await api.get(`/pedidos?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      throw error;
    }
  }

  static async get(id) {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw error;
    }
  }

  static async create(pedidoData) {
    try {
      const response = await api.post('/pedidos', pedidoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar pedido');
    }
  }

  static async update(id, pedidoData) {
    try {
      const response = await api.put(`/pedidos/${id}`, pedidoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw new Error(error.response?.data?.error || 'Erro ao atualizar pedido');
    }
  }

  static async delete(id) {
    try {
      const response = await api.delete(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar pedido');
    }
  }

  static async addComentario(pedidoId, conteudo) {
    try {
      const response = await api.post(`/pedidos/${pedidoId}/comentarios`, {
        conteudo,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw error;
    }
  }

  static async getStatistics() {
    try {
      const response = await api.get('/pedidos/statistics');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}
