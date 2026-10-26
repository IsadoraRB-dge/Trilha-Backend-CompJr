const AppError = require('../../../domain/errors/AppError');
const toAnimalResponse = require('../../utils/toAnimalResponse');

class GetAnimal {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute(id) {
    const animal = await this.animalRepository.findById(id);
    if (!animal) {
      throw new AppError('Animal não encontrado', 404);
    }

    return toAnimalResponse(animal);
  }
}

module.exports = GetAnimal;