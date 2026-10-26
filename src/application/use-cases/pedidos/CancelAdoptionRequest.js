const AppError = require('../../../domain/errors/AppError');
const { StatusPedido } = require('../../../domain/constants');
const { ehAdmin, ehAdotante } = require('../../../domain/policies/permissoes');

class CancelAdoptionRequest {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository;
  }

  async execute({ id, solicitante }) {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new AppError('Pedido não encontrado', 404);
    }

    if (!ehAdotante(pedido, solicitante) && !ehAdmin(solicitante)) {
      throw new AppError('Só quem fez o pedido pode cancelá-lo', 403);
    }

    if (pedido.status !== StatusPedido.PENDENTE) {
      throw new AppError('Só é possível cancelar pedidos pendentes', 409);
    }

    const concluido = await this.pedidoRepository.close({
      id,
      animalId: pedido.animalId,
      status: StatusPedido.CANCELADO,
    });

    if (!concluido) {
      throw new AppError('Só é possível cancelar pedidos pendentes', 409);
    }

    return this.pedidoRepository.findById(id);
  }
}

module.exports = CancelAdoptionRequest;