const AppError = require('../../../domain/errors/AppError');

function validate(schema, origem = 'body') {
  return (req, res, next) => {
    const resultado = schema.safeParse(req[origem] ?? {});

    if (!resultado.success) {
      const detalhes = resultado.error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message,
      }));
      return next(new AppError('Dados inválidos', 400, detalhes));
    }
    
    if (origem === 'body') {
      req.body = resultado.data;
    } else {
      req.validado = { ...req.validado, [origem]: resultado.data };
    }

    return next();
  };
}

module.exports = validate;