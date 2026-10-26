const AppError = require('../../../domain/errors/AppError');
const { StatusPedido } = require('../../../domain/constants');
const { podeGerenciarAnimal } = require('../../../domain/policies/permissoes');

class DecideAdoptionRequest {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository;
  }

  async execute({ id, solicitante, decisao }) {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new AppError('Pedido não encontrado', 404);
    }

    if (!podeGerenciarAnimal(pedido.animal, solicitante)) {
      throw new AppError('Só o dono do animal pode aprovar ou recusar o pedido', 403);
    }

    if (pedido.status !== StatusPedido.PENDENTE) {
      throw new AppError('Só é possível decidir pedidos pendentes', 409);
    }

    const concluido =
      decisao === StatusPedido.APROVADO
        ? await this.pedidoRepository.approve({ id, animalId: pedido.animalId })
        : await this.pedidoRepository.close({ id, animalId: pedido.animalId, status: StatusPedido.RECUSADO });

    if (!concluido) {
      throw new AppError('Só é possível decidir pedidos pendentes', 409);
    }

    return this.pedidoRepository.findById(id);
  }
}

module.exports = DecideAdoptionRequest;