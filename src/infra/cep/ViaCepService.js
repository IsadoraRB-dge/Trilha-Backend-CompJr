const AppError = require('../../domain/errors/AppError');

const TIMEOUT_MS = 5000;

class ViaCepService {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  async buscar(cep) {
    let resposta;

    try {
      resposta = await fetch(`${this.baseUrl}/${cep}/json/`, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      throw new AppError('Serviço de CEP indisponível. Tente novamente em alguns momentos.', 503);
    }

    if (resposta.status === 400) {
      throw new AppError('CEP inválido', 400);
    }

    if (!resposta.ok) {
      throw new AppError('Serviço de CEP indisponível. Tente novamente em alguns momentos.', 503);
    }

    const dados = await resposta.json();

    if (dados.erro) {
      throw new AppError('CEP não encontrado', 422);
    }

    return {
      cep,
      logradouro: dados.logradouro || null,
      bairro: dados.bairro || null,
      cidade: dados.localidade,
      uf: dados.uf,
    };
  }
}

module.exports = ViaCepService;