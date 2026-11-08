const AppError = require('../../../domain/errors/AppError');
const { StatusAnimal } = require('../../../domain/constants');
const { podeGerenciarAnimal } = require('../../../domain/policies/permissoes');

class DeleteAnimal {
  constructor({ animalRepository, imageStorage }) {
    this.animalRepository = animalRepository;
    this.imageStorage = imageStorage;
  }

  async execute({ id, solicitante }) {
    const animal = await this.animalRepository.findById(id);
    if (!animal) {
      throw new AppError('Animal não encontrado', 404);
    }

    if (!podeGerenciarAnimal(animal, solicitante)) {
      throw new AppError('Você não tem permissão para excluir este animal', 403);
    }
    
    if (animal.status === StatusAnimal.ADOTADO) {
      throw new AppError('Animal já adotado não pode ser excluído', 409);
    }

    await this.animalRepository.delete(id);
    await this.removerFotosDoArmazenamento(animal.fotos);
  }

   async removerFotosDoArmazenamento(fotos = []) {
    if (!this.imageStorage?.configurado) return;

    for (const foto of fotos) {
      await this.imageStorage.remove(foto.publicId).catch((err) => {
        console.error('Falha ao remover a foto do Cloudinary:', err);
      });
    }
  }
}

module.exports = DeleteAnimal;