const AppError = require('../../../domain/errors/AppError');
const toPublicUser = require('../../utils/toPublicUser');

class GetUser {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    const usuario = await this.userRepository.findById(id);
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return toPublicUser(usuario);
  }
}

module.exports = GetUser;