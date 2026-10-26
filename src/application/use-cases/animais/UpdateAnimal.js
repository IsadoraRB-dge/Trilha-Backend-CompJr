const AppError = require('../../../domain/errors/AppError');
const { StatusAnimal } = require('../../../domain/constants');
const { podeGerenciarAnimal } = require('../../../domain/policies/permissoes');
const toAnimalResponse = require('../../utils/toAnimalResponse');

class UpdateAnimal {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ id, solicitante, dados }) {
    const animal = await this.animalRepository.findById(id);
    if (!animal) {
      throw new AppError('Animal não encontrado', 404);
    }

    if (!podeGerenciarAnimal(animal, solicitante)) {
      throw new AppError('Você não tem permissão para alterar este animal', 403);
    }

    if (animal.status === StatusAnimal.ADOTADO) {
      throw new AppError('Animal já adotado não pode ser alterado', 409);
    }

    const { cachorro, gato, ...comuns } = dados;

    // A espécie não muda: só aceita os dados específicos da espécie do animal
    if (cachorro && !animal.cachorro) {
      throw new AppError('Este animal é um gato: envie os dados em "gato", e não em "cachorro"', 400);
    }
    if (gato && !animal.gato) {
      throw new AppError('Este animal é um cachorro: envie os dados em "cachorro", e não em "gato"', 400);
    }

    const atualizado = await this.animalRepository.update(id, {
      dados: comuns,
      cachorro,
      gato,
    });

    return toAnimalResponse(atualizado);
  }
}

module.exports = UpdateAnimal;