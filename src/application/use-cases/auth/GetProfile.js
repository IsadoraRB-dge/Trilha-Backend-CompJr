const AppError = require('../../../domain/errors/AppError');
const toPublicUser = require('../../utils/toPublicUser');

class GetProfile {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(usuarioId) {
    const usuario = await this.userRepository.findById(usuarioId);
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return toPublicUser(usuario);
  }
}

module.exports = GetProfile;