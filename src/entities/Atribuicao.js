// Mock Atribuicao entity - Replace with actual API implementation
const mockAtribuicoes = [];

export class Atribuicao {
  static async list() {
    // Mock list atribuicoes
    return mockAtribuicoes;
  }

  static async create(atribuicaoData) {
    // Mock create atribuicao
    const newAtribuicao = {
      id: mockAtribuicoes.length + 1,
      criado_em: new Date().toISOString(),
      ...atribuicaoData
    };
    mockAtribuicoes.push(newAtribuicao);
    return newAtribuicao;
  }

  static async delete(id) {
    // Mock delete atribuicao
    const atribuicaoIndex = mockAtribuicoes.findIndex(a => a.id === id);
    if (atribuicaoIndex !== -1) {
      mockAtribuicoes.splice(atribuicaoIndex, 1);
      return true;
    }
    return false;
  }
}
