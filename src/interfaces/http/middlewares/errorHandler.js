const AppError = require('../../../domain/errors/AppError');
const traduzirErroPrisma = require('../../../infra/database/prismaErrors');

function responder(res, erro) {
  return res.status(erro.statusCode).json({
    error: {
      message: erro.message,
      ...(erro.details && { details: erro.details }),
    },
  });
}

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return responder(res, err);
  }

  if (err.type === 'entity.parse.failed') {
    return responder(res, new AppError('JSON inválido no corpo da requisição', 400));
  }

  if (err.type === 'entity.too.large') {
    return responder(res, new AppError('Corpo da requisição muito grande', 413));
  }

  const erroPrisma = traduzirErroPrisma(err);
  if (erroPrisma) {
    return responder(res, erroPrisma);
  }

  console.error(err);

  return responder(res, new AppError('Erro interno do servidor', 500));
  
}

module.exports = errorHandler;