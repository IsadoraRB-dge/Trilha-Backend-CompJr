const AppError = require('../../../domain/errors/AppError');
const toPublicUser = require('../../utils/toPublicUser');

class UpdateProfile {
  constructor({ userRepository, cepService }) {
    this.userRepository = userRepository;
    this.cepService = cepService;
  }

  async execute({ solicitante, nome, cep }) {
    const usuario = await this.userRepository.findById(solicitante.id);
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const dados = {};
    if (nome) dados.nome = nome;

    if (cep && cep !== usuario.cep) {
      const endereco = await this.cepService.buscar(cep);
      dados.cep = endereco.cep;
      dados.logradouro = endereco.logradouro;
      dados.bairro = endereco.bairro;
      dados.cidade = endereco.cidade;
      dados.uf = endereco.uf;
    }

    if (Object.keys(dados).length === 0) {
      return toPublicUser(usuario);
    }

    const atualizado = await this.userRepository.update(solicitante.id, dados);
    return toPublicUser(atualizado);
  }
}

module.exports = UpdateProfile;