const AppError = require('../../../domain/errors/AppError');

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: { message: 'JSON inválido no corpo da requisição' },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: { message: 'Erro interno do servidor' },
  });
}

module.exports = errorHandler;