const AppError = require('../../../domain/errors/AppError');
const toPublicUser = require('../../utils/toPublicUser');

class RegisterUser {
  constructor({ userRepository, passwordHasher, cepService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.cepService = cepService;
  }

  async execute({ nome, email, senha, cep }) {
    const existente = await this.userRepository.findByEmail(email);
    if (existente) {
      throw new AppError('E-mail já cadastrado', 409);
    }

    const endereco = await this.cepService.buscar(cep);
    const senhaHash = await this.passwordHasher.hash(senha);

    const usuario = await this.userRepository.create({
      nome,
      email,
      senha: senhaHash,
      perfil: 'COMUM',
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      uf: endereco.uf,
    });

    return toPublicUser(usuario);
  }
}

module.exports = RegisterUser;