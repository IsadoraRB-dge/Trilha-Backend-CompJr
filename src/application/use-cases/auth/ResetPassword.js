const AppError = require('../../../domain/errors/AppError');

class ResetPassword {
  constructor({ passwordResetRepository, passwordHasher, resetTokenGenerator }) {
    this.passwordResetRepository = passwordResetRepository;
    this.passwordHasher = passwordHasher;
    this.resetTokenGenerator = resetTokenGenerator;
  }

  async execute({ token, novaSenha }) {
    const tokenHash = this.resetTokenGenerator.hash(token);
    const registro = await this.passwordResetRepository.findByHash(tokenHash);

    const valido = registro && !registro.usadoEm && registro.expiraEm > new Date();
    if (!valido) {
      throw new AppError('Código de recuperação inválido ou expirado', 400);
    }

    const senhaHash = await this.passwordHasher.hash(novaSenha);

    const redefinida = await this.passwordResetRepository.resetPassword({
      tokenId: registro.id,
      usuarioId: registro.usuarioId,
      senhaHash,
    });

    if (!redefinida) {
      throw new AppError('Código de recuperação inválido ou expirado', 400);
    }
  }
}

module.exports = ResetPassword;