const { test } = require('node:test');
const assert = require('node:assert/strict');

const CreateAdoptionRequest = require('../../src/application/use-cases/pedidos/CreateAdoptionRequest');
const DecideAdoptionRequest = require('../../src/application/use-cases/pedidos/DecideAdoptionRequest');
const CancelAdoptionRequest = require('../../src/application/use-cases/pedidos/CancelAdoptionRequest');

const dona = { id: 1, perfil: 'COMUM' };
const adotante = { id: 2, perfil: 'COMUM' };
const outro = { id: 3, perfil: 'COMUM' };
const admin = { id: 9, perfil: 'ADMIN' };

function criarCenario({ statusAnimal = 'DISPONIVEL', pendente = null, statusPedido = 'PENDENTE' } = {}) {
  const animal = { id: 10, usuarioId: dona.id, status: statusAnimal };
  const pedido = { id: 50, usuarioId: adotante.id, animalId: animal.id, status: statusPedido, animal };

  const animalRepository = { findById: async (id) => (id === animal.id ? animal : null) };
  const pedidoRepository = {
    findPendente: async () => pendente,
    create: async (dados) => ({ id: 51, status: 'PENDENTE', ...dados }),
    findById: async (id) => (id === pedido.id ? pedido : null),
    approve: async () => true,
    close: async () => true,
  };

  return { animal, pedido, animalRepository, pedidoRepository };
}

test('não é possível pedir o próprio animal (403)', async () => {
  const { animalRepository, pedidoRepository } = criarCenario();
  const uc = new CreateAdoptionRequest({ animalRepository, pedidoRepository });

  await assert.rejects(uc.execute({ animalId: 10, solicitante: dona, motivo: 'Quero meu animal' }), { statusCode: 403 });
});

test('não é possível pedir animal já adotado (409)', async () => {
  const { animalRepository, pedidoRepository } = criarCenario({ statusAnimal: 'ADOTADO' });
  const uc = new CreateAdoptionRequest({ animalRepository, pedidoRepository });

  await assert.rejects(uc.execute({ animalId: 10, solicitante: adotante, motivo: 'Quero adotar' }), { statusCode: 409 });
});

test('não é possível ter dois pedidos pendentes para o mesmo animal (409)', async () => {
  const { animalRepository, pedidoRepository } = criarCenario({ pendente: { id: 1 } });
  const uc = new CreateAdoptionRequest({ animalRepository, pedidoRepository });

  await assert.rejects(uc.execute({ animalId: 10, solicitante: adotante, motivo: 'Quero adotar' }), { statusCode: 409 });
});

test('só o dono do animal ou o admin aprovam o pedido', async () => {
  const { pedidoRepository } = criarCenario();
  const uc = new DecideAdoptionRequest({ pedidoRepository });

  await assert.rejects(uc.execute({ id: 50, solicitante: outro, decisao: 'APROVADO' }), { statusCode: 403 });
  await assert.rejects(uc.execute({ id: 50, solicitante: adotante, decisao: 'APROVADO' }), { statusCode: 403 });
  await assert.doesNotReject(uc.execute({ id: 50, solicitante: dona, decisao: 'APROVADO' }));
  await assert.doesNotReject(uc.execute({ id: 50, solicitante: admin, decisao: 'RECUSADO' }));
});

test('pedido já decidido não pode ser aprovado nem cancelado (409)', async () => {
  const { pedidoRepository } = criarCenario({ statusPedido: 'RECUSADO' });

  await assert.rejects(
    new DecideAdoptionRequest({ pedidoRepository }).execute({ id: 50, solicitante: dona, decisao: 'APROVADO' }),
    { statusCode: 409 },
  );
  await assert.rejects(
    new CancelAdoptionRequest({ pedidoRepository }).execute({ id: 50, solicitante: adotante }),
    { statusCode: 409 },
  );
});

test('só o adotante ou o admin cancelam o pedido', async () => {
  const { pedidoRepository } = criarCenario();
  const uc = new CancelAdoptionRequest({ pedidoRepository });

  await assert.rejects(uc.execute({ id: 50, solicitante: dona }), { statusCode: 403 });
  await assert.doesNotReject(uc.execute({ id: 50, solicitante: adotante }));
});