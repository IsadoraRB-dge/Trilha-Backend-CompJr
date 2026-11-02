const AppError = require('../../../domain/errors/AppError');
const { ehAdmin } = require('../../../domain/policies/permissoes');

class DeleteAccount {
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ solicitante, senha }) {
    const usuario = await this.userRepository.findById(solicitante.id);
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (ehAdmin(usuario)) {
      throw new AppError('Administradores não podem excluir a própria conta', 403);
    }

    const senhaCorreta = await this.passwordHasher.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      throw new AppError('Senha incorreta', 400);
    }

    const excluido = await this.userRepository.deleteAccount(solicitante.id);
    if (!excluido) {
      throw new AppError('Contas com adoções concluídas não podem ser excluídas, para preservar o histórico', 409);
    }
  }
}

module.exports = DeleteAccount;