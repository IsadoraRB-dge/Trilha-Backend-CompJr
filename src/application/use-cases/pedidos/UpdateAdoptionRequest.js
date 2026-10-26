const AppError = require('../../../domain/errors/AppError');
const { StatusPedido } = require('../../../domain/constants');
const { ehAdotante } = require('../../../domain/policies/permissoes');

class UpdateAdoptionRequest {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository;
  }

  async execute({ id, solicitante, motivo }) {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new AppError('Pedido não encontrado', 404);
    }

    if (!ehAdotante(pedido, solicitante)) {
      throw new AppError('Só quem fez o pedido pode alterá-lo', 403);
    }

    if (pedido.status !== StatusPedido.PENDENTE) {
      throw new AppError('Só é possível alterar pedidos pendentes', 409);
    }

    const atualizado = await this.pedidoRepository.updateMotivo(id, motivo);
    if (!atualizado) {
      throw new AppError('Só é possível alterar pedidos pendentes', 409);
    }

    return atualizado;
  }
}

module.exports = UpdateAdoptionRequest;