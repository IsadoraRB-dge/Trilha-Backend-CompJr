const { Perfil } = require('../constants');

function ehAdmin(solicitante) {
  return solicitante.perfil === Perfil.ADMIN;
}

function podeGerenciarAnimal(animal, solicitante) {
  return ehAdmin(solicitante) || animal.usuarioId === solicitante.id;
}

function ehAdotante(pedido, solicitante) {
  return pedido.usuarioId === solicitante.id;
}

module.exports = { ehAdmin, podeGerenciarAnimal, ehAdotante };