
function toPublicUser(usuario) {
  if (!usuario) return null;

  // eslint-disable-next-line no-unused-vars
  const { senha, senhaAlteradaEm, ...publico } = usuario;
  return publico;
}

module.exports = toPublicUser;