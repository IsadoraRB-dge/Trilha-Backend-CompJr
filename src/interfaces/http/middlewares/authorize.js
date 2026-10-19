const AppError = require('../../../domain/errors/AppError');

function authorize(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
      return next(new AppError('Você não tem permissão para acessar este recurso', 403));
    }
    return next();
  };
}

module.exports = authorize;