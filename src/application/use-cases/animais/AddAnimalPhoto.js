const AppError = require('../../../domain/errors/AppError');
const { StatusAnimal } = require('../../../domain/constants');
const { podeGerenciarAnimal } = require('../../../domain/policies/permissoes');

const MAXIMO_FOTOS = 5;

class AddAnimalPhoto {
  constructor({ animalRepository, fotoRepository, imageStorage }) {
    this.animalRepository = animalRepository;
    this.fotoRepository = fotoRepository;
    this.imageStorage = imageStorage;
  }

  async execute({ animalId, solicitante, arquivo }) {
    if (!this.imageStorage.configurado) {
      throw new AppError('O envio de fotos não está configurado neste ambiente. Veja o README.', 503);
    }

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

    const quantidade = await this.fotoRepository.countByAnimal(animalId);
    if (quantidade >= MAXIMO_FOTOS) {
      throw new AppError(`Cada animal pode ter no máximo ${MAXIMO_FOTOS} fotos`, 409);
    }

    let enviada;
    try {
      enviada = await this.imageStorage.upload(arquivo.buffer);
    } catch (err) {
      console.error('Falha ao enviar a foto para o Cloudinary:', err);
      throw new AppError('Não foi possível enviar a foto. Tente novamente em instantes.', 503);
    }

    return this.fotoRepository.create({ animalId, url: enviada.url, publicId: enviada.publicId });
  }
}

module.exports = AddAnimalPhoto;