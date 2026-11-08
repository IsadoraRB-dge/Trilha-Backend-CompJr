const AppError = require('../../domain/errors/AppError');

function traduzirErroPrisma(err) {
  if (err?.name === 'PrismaClientInitializationError') {
    return new AppError('Banco de dados indisponível', 503);
  }

  if (err?.name !== 'PrismaClientKnownRequestError') return null;

  switch (err.code) {
    case 'P2025': 
      return new AppError('Registro não encontrado', 404);
    case 'P2002':
      return new AppError('Já existe um registro com esses dados', 409);
    case 'P2003': 
      return new AppError('Operação não permitida: o registro está ligado a outros dados', 409);
    default:
      return null;
  }
}

module.exports = traduzirErroPrisma;