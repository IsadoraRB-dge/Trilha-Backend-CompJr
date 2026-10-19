const AppError = require('../../../domain/errors/AppError');

function validate(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body ?? {});

    if (!resultado.success) {
      const detalhes = resultado.error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message,
      }));
      return next(new AppError('Dados inválidos', 400, detalhes));
    }

    req.body = resultado.data;
    return next();
  };
}

module.exports = validate;