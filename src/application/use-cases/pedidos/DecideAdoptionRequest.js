const AppError = require('../../../domain/errors/AppError');
const { StatusPedido } = require('../../../domain/constants');
const { podeGerenciarAnimal } = require('../../../domain/policies/permissoes');

class DecideAdoptionRequest {
  constructor({ pedidoRepository, mailer }) {
    this.pedidoRepository = pedidoRepository;
    this.mailer = mailer;
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

    const aprovado = decisao === StatusPedido.APROVADO;

    const concluido =
      decisao === StatusPedido.APROVADO
        ? await this.pedidoRepository.approve({ id, animalId: pedido.animalId })
        : await this.pedidoRepository.close({ id, animalId: pedido.animalId, status: StatusPedido.RECUSADO });

    if (!concluido) {
      throw new AppError('Só é possível decidir pedidos pendentes', 409);
    }

    await this.notificarAdotante(pedido, aprovado);

    return this.pedidoRepository.findById(id);
  }

  async notificarAdotante(pedido, aprovado) {
    if (!this.mailer) return;

    try {
      await this.mailer.sendDecisaoPedido({
        para: pedido.adotante.email,
        nomeAdotante: pedido.adotante.nome,
        nomeAnimal: pedido.animal.nome,
        aprovado,
      });
    } catch (err) {
      console.error('Falha ao notificar o adotante:', err);
    }
  }

}

module.exports = DecideAdoptionRequest;