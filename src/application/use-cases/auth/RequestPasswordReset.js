class RequestPasswordReset {
  constructor({ userRepository, passwordResetRepository, resetTokenGenerator, mailer, expiresMinutes }) {
    this.userRepository = userRepository;
    this.passwordResetRepository = passwordResetRepository;
    this.resetTokenGenerator = resetTokenGenerator;
    this.mailer = mailer;
    this.expiresMinutes = expiresMinutes;
  }

  async execute({ email }) {
    const usuario = await this.userRepository.findByEmail(email);

    if (!usuario) return;

    await this.passwordResetRepository.invalidateAllForUser(usuario.id);

    const { token, tokenHash } = this.resetTokenGenerator.generate();
    const expiraEm = new Date(Date.now() + this.expiresMinutes * 60 * 1000);

    await this.passwordResetRepository.create({
      usuarioId: usuario.id,
      tokenHash,
      expiraEm,
    });

    await this.mailer.sendPasswordReset({
      para: usuario.email,
      nome: usuario.nome,
      token,
      expiresMinutes: this.expiresMinutes,
    });
  }
}

module.exports = RequestPasswordReset;