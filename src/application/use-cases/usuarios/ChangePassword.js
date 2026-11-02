const AppError = require('../../../domain/errors/AppError');

class ChangePassword {
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ solicitante, senhaAtual, novaSenha }) {
    const usuario = await this.userRepository.findById(solicitante.id);
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const senhaCorreta = await this.passwordHasher.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      throw new AppError('Senha atual incorreta', 400);
    }

    if (senhaAtual === novaSenha) {
      throw new AppError('A nova senha deve ser diferente da atual', 400);
    }

    const senhaHash = await this.passwordHasher.hash(novaSenha);
    await this.userRepository.updatePassword(solicitante.id, senhaHash);
  }
}

module.exports = ChangePassword;