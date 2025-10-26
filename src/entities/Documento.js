// Mock Documento entity - Replace with actual API implementation
const mockDocumentos = [];

export class Documento {
  static async list(pedidoId) {
    // Mock list documentos for pedido
    return mockDocumentos.filter(d => d.pedido_id === pedidoId);
  }

  static async create(documentoData) {
    // Mock create documento
    const newDocumento = {
      id: mockDocumentos.length + 1,
      criado_em: new Date().toISOString(),
      ...documentoData
    };
    mockDocumentos.push(newDocumento);
    return newDocumento;
  }

  static async delete(id) {
    // Mock delete documento
    const documentoIndex = mockDocumentos.findIndex(d => d.id === id);
    if (documentoIndex !== -1) {
      mockDocumentos.splice(documentoIndex, 1);
      return true;
    }
    return false;
  }
}
