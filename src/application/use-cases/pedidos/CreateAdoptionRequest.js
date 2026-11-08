const AppError = require('../../../domain/errors/AppError');
const { StatusAnimal } = require('../../../domain/constants');

class CreateAdoptionRequest {
  constructor({ animalRepository, pedidoRepository, userRepository, mailer }) {
    this.animalRepository = animalRepository;
    this.pedidoRepository = pedidoRepository;
    this.userRepository = userRepository;
    this.mailer = mailer;
  }

  async execute({ animalId, solicitante, motivo }) {
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new AppError('Animal não encontrado', 404);
    }

    if (animal.usuarioId === solicitante.id) {
      throw new AppError('Você não pode pedir para adotar o próprio animal', 403);
    }

    if (animal.status === StatusAnimal.ADOTADO) {
      throw new AppError('Este animal já foi adotado', 409);
    }

    const pendente = await this.pedidoRepository.findPendente({ usuarioId: solicitante.id, animalId });
    if (pendente) {
      throw new AppError('Você já tem um pedido pendente para este animal', 409);
    }

    const pedido = await this.pedidoRepository.create({ usuarioId: solicitante.id, animalId, motivo });

    if (!pedido) {
      throw new AppError('Este animal já foi adotado', 409);
    }

    await this.notificarDono(animal, pedido);

    return pedido;
  }

   async notificarDono(animal, pedido) {
    if (!this.mailer || !this.userRepository) return;

    try {
      const dono = await this.userRepository.findById(animal.usuarioId);
      await this.mailer.sendNovoPedido({
        para: dono.email,
        nomeDono: dono.nome,
        nomeAnimal: animal.nome,
        nomeAdotante: pedido.adotante.nome,
        motivo: pedido.motivo,
      });
    } catch (err) {
      console.error('Falha ao notificar o dono do animal:', err);
    }
  }
}

module.exports = CreateAdoptionRequest;