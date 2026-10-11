const AppError = require('../../../domain/errors/AppError');

function notFound(req, res, next) {
  next(new AppError(`Rota ${req.method} ${req.originalUrl} não encontrada`, 404));
}

module.exports = notFound;