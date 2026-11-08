const { test } = require('node:test');
const assert = require('node:assert/strict');

const CreateAdoptionRequest = require('../../src/application/use-cases/pedidos/CreateAdoptionRequest');
const DecideAdoptionRequest = require('../../src/application/use-cases/pedidos/DecideAdoptionRequest');

function criarMailer({ falhar = false } = {}) {
  const enviados = [];
  const registrar = (tipo) => async (dados) => {
    if (falhar) throw new Error('servidor de e-mail fora do ar');
    enviados.push({ tipo, ...dados });
  };
  return { enviados, sendNovoPedido: registrar('novo'), sendDecisaoPedido: registrar('decisao') };
}

const animal = { id: 10, nome: 'Rex', usuarioId: 1, status: 'DISPONIVEL' };
const dona = { id: 1, nome: 'Ana', email: 'ana@gmail.com', perfil: 'COMUM' };
const adotante = { id: 2, nome: 'João', email: 'joao@gmail.com', perfil: 'COMUM' };

function dependenciasDoPedido(mailer) {
  return {
    animalRepository: { findById: async () => animal },
    pedidoRepository: {
      findPendente: async () => null,
      create: async (dados) => ({ id: 50, status: 'PENDENTE', ...dados, adotante }),
    },
    userRepository: { findById: async () => dona },
    mailer,
  };
}

test('novo pedido avisa o dono do animal por e-mail', async () => {
  const mailer = criarMailer();
  const uc = new CreateAdoptionRequest(dependenciasDoPedido(mailer));

  await uc.execute({ animalId: 10, solicitante: adotante, motivo: 'Tenho quintal grande' });

  assert.equal(mailer.enviados.length, 1);
  assert.equal(mailer.enviados[0].para, 'ana@gmail.com');
  assert.equal(mailer.enviados[0].nomeAdotante, 'João');
});

test('falha no envio do e-mail não impede a criação do pedido', async () => {
  const uc = new CreateAdoptionRequest(dependenciasDoPedido(criarMailer({ falhar: true })));

  const pedido = await uc.execute({ animalId: 10, solicitante: adotante, motivo: 'Tenho quintal grande' });

  assert.equal(pedido.status, 'PENDENTE');
});

test('aprovar e recusar avisam o adotante, com o resultado certo', async () => {
  const pedido = { id: 50, usuarioId: 2, animalId: 10, status: 'PENDENTE', animal, adotante };
  const pedidoRepository = {
    findById: async () => pedido,
    approve: async () => true,
    close: async () => true,
  };
  const mailer = criarMailer();
  const uc = new DecideAdoptionRequest({ pedidoRepository, mailer });

  await uc.execute({ id: 50, solicitante: dona, decisao: 'APROVADO' });
  await uc.execute({ id: 50, solicitante: dona, decisao: 'RECUSADO' });

  assert.equal(mailer.enviados.length, 2);
  assert.equal(mailer.enviados[0].para, 'joao@gmail.com');
  assert.equal(mailer.enviados[0].aprovado, true);
  assert.equal(mailer.enviados[1].aprovado, false);
});