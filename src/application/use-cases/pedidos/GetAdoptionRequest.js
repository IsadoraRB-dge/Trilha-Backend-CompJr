const AppError = require('../../../domain/errors/AppError');
const { ehAdmin, ehAdotante } = require('../../../domain/policies/permissoes');

class GetAdoptionRequest {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository;
  }

  async execute({ id, solicitante }) {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new AppError('Pedido não encontrado', 404);
    }

    const ehDonoDoAnimal = pedido.animal.usuarioId === solicitante.id;
    if (!ehAdmin(solicitante) && !ehAdotante(pedido, solicitante) && !ehDonoDoAnimal) {
      throw new AppError('Você não tem permissão para ver este pedido', 403);
    }

    return pedido;
  }
}

module.exports = GetAdoptionRequest;