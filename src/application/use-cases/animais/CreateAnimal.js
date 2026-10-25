const toAnimalResponse = require('../../utils/toAnimalResponse');

class CreateAnimal {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ solicitante, dados }) {
    const { especie, cachorro, gato, ...comuns } = dados;

    const animal = await this.animalRepository.create({
      usuarioId: solicitante.id,
      dados: comuns,
      especie,
      especificos: cachorro || gato,
    });

    return toAnimalResponse(animal);
  }
}

module.exports = CreateAnimal;