class EnsureAdminUser {
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ nome, email, senha, cep, cidade, uf }) {
    if (!email || !senha) {
      console.warn('ADMIN_EMAIL ou ADMIN_PASSWORD não definidos: administrador inicial não foi criado.');
      return;
    }

    const existente = await this.userRepository.findByEmail(email.toLowerCase());
    if (existente) return;

    await this.userRepository.create({
      nome,
      email: email.toLowerCase(),
      senha: await this.passwordHasher.hash(senha),
      perfil: 'ADMIN',
      cep,
      cidade,
      uf,
    });

    console.log(`Administrador inicial criado: ${email}`);
  }
}

module.exports = EnsureAdminUser;