const AppError = require('../../../domain/errors/AppError');
const { ehAdmin } = require('../../../domain/policies/permissoes');

class DeleteUser {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    const usuario = await this.userRepository.findById(id);
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (ehAdmin(usuario)) {
      throw new AppError('Administradores não podem ser excluídos. Altere o perfil para COMUM antes.', 403);
    }

    const excluido = await this.userRepository.deleteAccount(id);
    if (!excluido) {
      throw new AppError('Contas com adoções concluídas não podem ser excluídas, para preservar o histórico', 409);
    }
  }
}

module.exports = DeleteUser;