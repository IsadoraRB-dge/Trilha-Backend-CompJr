const AppError = require('../../../domain/errors/AppError');
const toPublicUser = require('../../utils/toPublicUser');

class LoginUser {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute({ email, senha }) {
    const usuario = await this.userRepository.findByEmail(email);

    const senhaCorreta = usuario
      ? await this.passwordHasher.compare(senha, usuario.senha)
      : false;

    if (!senhaCorreta) {
      throw new AppError('E-mail ou senha inválidos', 401);
    }

    const token = this.tokenService.generate({
      sub: String(usuario.id),
      perfil: usuario.perfil,
    });

    return { token, usuario: toPublicUser(usuario) };
  }
}

module.exports = LoginUser;