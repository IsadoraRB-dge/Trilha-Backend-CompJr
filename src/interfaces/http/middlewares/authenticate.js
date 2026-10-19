const AppError = require('../../../domain/errors/AppError');

function makeAuthenticate({ tokenService, userRepository }) {
  return async function authenticate(req, res, next) {
    const [tipo, token] = (req.headers.authorization || '').split(' ');

    if (tipo !== 'Bearer' || !token) {
      throw new AppError('Token de autenticação não informado', 401);
    }

    const payload = tokenService.verify(token);
    if (!payload) {
      throw new AppError('Token inválido ou expirado', 401);
    }

    const usuario = await userRepository.findById(Number(payload.sub));
    if (!usuario) {
      throw new AppError('Token inválido ou expirado', 401);
    }

    if (usuario.senhaAlteradaEm) {
      const alteradaEmSegundos = Math.floor(usuario.senhaAlteradaEm.getTime() / 1000);
      if (payload.iat < alteradaEmSegundos) {
        throw new AppError('Sessão expirada. Faça login novamente.', 401);
      }
    }

    req.usuario = { id: usuario.id, perfil: usuario.perfil };
    return next();
  };
}

module.exports = makeAuthenticate;