const AppError = require('../../../domain/errors/AppError');
const toPublicUser = require('../../utils/toPublicUser');

class ChangeUserRole {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ id, solicitante, perfil }) {

    if (id === solicitante.id) {
      throw new AppError('Você não pode alterar o próprio perfil', 400);
    }

    const usuario = await this.userRepository.findById(id);
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const atualizado = await this.userRepository.update(id, { perfil });
    return toPublicUser(atualizado);
  }
}

module.exports = ChangeUserRole;