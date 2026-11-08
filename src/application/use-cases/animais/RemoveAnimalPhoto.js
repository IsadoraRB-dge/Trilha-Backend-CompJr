const AppError = require('../../../domain/errors/AppError');
const { StatusAnimal } = require('../../../domain/constants');
const { podeGerenciarAnimal } = require('../../../domain/policies/permissoes');

class RemoveAnimalPhoto {
  constructor({ animalRepository, fotoRepository, imageStorage }) {
    this.animalRepository = animalRepository;
    this.fotoRepository = fotoRepository;
    this.imageStorage = imageStorage;
  }

  async execute({ animalId, fotoId, solicitante }) {
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new AppError('Animal não encontrado', 404);
    }

    if (!podeGerenciarAnimal(animal, solicitante)) {
      throw new AppError('Você não tem permissão para alterar este animal', 403);
    }

    if (animal.status === StatusAnimal.ADOTADO) {
      throw new AppError('Animal já adotado não pode ser alterado', 409);
    }

    const foto = await this.fotoRepository.findById(fotoId);
    if (!foto || foto.animalId !== animalId) {
      throw new AppError('Foto não encontrada', 404);
    }

    await this.fotoRepository.delete(fotoId);

    if (this.imageStorage.configurado) {
      await this.imageStorage.remove(foto.publicId).catch((err) => {
        console.error('Falha ao remover a foto do Cloudinary:', err);
      });
    }
  }
}

module.exports = RemoveAnimalPhoto;