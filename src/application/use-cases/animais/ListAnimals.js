const toAnimalResponse = require('../../utils/toAnimalResponse');
const paginar = require('../../utils/paginar');

class ListAnimals {
  constructor({ animalRepository }) {
    this.animalRepository = animalRepository;
  }

  async execute({ pagina, limite, ...filtros }) {
    const { dados, total } = await this.animalRepository.list({ filtros, pagina, limite });

    return paginar({ dados: dados.map(toAnimalResponse), total, pagina, limite });
  }
}

module.exports = ListAnimals;