const AppError = require('../../../domain/errors/AppError');
const { podeGerenciarAnimal } = require('../../../domain/policies/permissoes');
const paginar = require('../../utils/paginar');

class ListAdoptionRequests {
  constructor({ animalRepository, pedidoRepository }) {
    this.animalRepository = animalRepository;
    this.pedidoRepository = pedidoRepository;
  }

  async execute({ escopo, solicitante, animalId, status, pagina, limite }) {
    const filtros = { status };

    if (escopo === 'meus') {
      filtros.usuarioId = solicitante.id;
    }

    if (escopo === 'animal') {
      const animal = await this.animalRepository.findById(animalId);
      if (!animal) {
        throw new AppError('Animal não encontrado', 404);
      }
      if (!podeGerenciarAnimal(animal, solicitante)) {
        throw new AppError('Só o dono do animal pode ver os pedidos recebidos', 403);
      }
      filtros.animalId = animalId;
    }

    const { dados, total } = await this.pedidoRepository.list({ filtros, pagina, limite });
    return paginar({ dados, total, pagina, limite });
  }
}

module.exports = ListAdoptionRequests;