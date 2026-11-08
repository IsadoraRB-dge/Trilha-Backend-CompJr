const rateLimit = require('express-rate-limit');
const AppError = require('../../../domain/errors/AppError');

function criarLimitador({ minutos, maximo, mensagem }) {
  return rateLimit({
    windowMs: minutos * 60 * 1000,
    limit: maximo,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res, next) => next(new AppError(mensagem, 429)),
  });
}

const loginLimiter = criarLimitador({
  minutos: 15,
  maximo: 20,
  mensagem: 'Várias tentativas de login. Tente novamente em alguns minutos.',
});

const cadastroLimiter = criarLimitador({
  minutos: 60,
  maximo: 20,
  mensagem: 'Vários cadastros feitos a partir deste endereço. Tente novamente mais tarde.',
});

const recuperacaoLimiter = criarLimitador({
  minutos: 15,
  maximo: 5,
  mensagem: 'Muitas solicitações de recuperação de senha. Tente novamente em alguns minutos.',
});

module.exports = { loginLimiter, cadastroLimiter, recuperacaoLimiter };