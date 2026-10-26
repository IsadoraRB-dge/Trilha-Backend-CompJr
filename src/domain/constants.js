const Perfil = Object.freeze({
  COMUM: 'COMUM',
  ADMIN: 'ADMIN',
});

const Especie = Object.freeze({
  CACHORRO: 'CACHORRO',
  GATO: 'GATO',
});

const StatusAnimal = Object.freeze({
  DISPONIVEL: 'DISPONIVEL',
  EM_PROCESSO: 'EM_PROCESSO',
  ADOTADO: 'ADOTADO',
});

const StatusPedido = Object.freeze({
  PENDENTE: 'PENDENTE',
  APROVADO: 'APROVADO',
  RECUSADO: 'RECUSADO',
  CANCELADO: 'CANCELADO',
});

module.exports = { Perfil, Especie, StatusAnimal, StatusPedido };