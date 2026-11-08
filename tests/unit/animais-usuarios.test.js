const { test } = require('node:test');
const assert = require('node:assert/strict');

const UpdateAnimal = require('../../src/application/use-cases/animais/UpdateAnimal');
const DeleteAnimal = require('../../src/application/use-cases/animais/DeleteAnimal');
const DeleteAccount = require('../../src/application/use-cases/usuarios/DeleteAccount');
const ChangeUserRole = require('../../src/application/use-cases/usuarios/ChangeUserRole');
const { FakeUserRepository, fakeHasher } = require('./fakes');

function repositorioCom(animal) {
  return {
    findById: async (id) => (id === animal.id ? animal : null),
    update: async (id, { dados }) => ({ ...animal, ...dados }),
    delete: async () => {},
  };
}

test('só o dono ou o admin alteram o animal', async () => {
  const animal = { id: 1, usuarioId: 1, status: 'DISPONIVEL', cachorro: { porte: 'GRANDE' } };
  const uc = new UpdateAnimal({ animalRepository: repositorioCom(animal) });

  await assert.rejects(uc.execute({ id: 1, solicitante: { id: 2, perfil: 'COMUM' }, dados: { nome: 'X' } }), { statusCode: 403 });
  await assert.doesNotReject(uc.execute({ id: 1, solicitante: { id: 1, perfil: 'COMUM' }, dados: { nome: 'X' } }));
  await assert.doesNotReject(uc.execute({ id: 1, solicitante: { id: 9, perfil: 'ADMIN' }, dados: { nome: 'Y' } }));
});

test('dados de gato não são aceitos para um cachorro (400)', async () => {
  const animal = { id: 1, usuarioId: 1, status: 'DISPONIVEL', cachorro: { porte: 'GRANDE' } };
  const uc = new UpdateAnimal({ animalRepository: repositorioCom(animal) });

  await assert.rejects(
    uc.execute({ id: 1, solicitante: { id: 1, perfil: 'COMUM' }, dados: { gato: { testadoFivFelv: true } } }),
    { statusCode: 400 },
  );
});

test('animal adotado não pode ser alterado nem excluído (409)', async () => {
  const animal = { id: 1, usuarioId: 1, status: 'ADOTADO', cachorro: { porte: 'GRANDE' } };
  const dono = { id: 1, perfil: 'COMUM' };

  await assert.rejects(
    new UpdateAnimal({ animalRepository: repositorioCom(animal) }).execute({ id: 1, solicitante: dono, dados: { nome: 'X' } }),
    { statusCode: 409 },
  );
  await assert.rejects(
    new DeleteAnimal({ animalRepository: repositorioCom(animal) }).execute({ id: 1, solicitante: dono }),
    { statusCode: 409 },
  );
});

test('exclusão de conta exige a senha correta e bloqueia administradores', async () => {
  const userRepository = new FakeUserRepository([
    { id: 1, perfil: 'COMUM', senha: 'hash:senha1234' },
    { id: 2, perfil: 'ADMIN', senha: 'hash:admin1234' },
  ]);
  const uc = new DeleteAccount({ userRepository, passwordHasher: fakeHasher });

  await assert.rejects(uc.execute({ solicitante: { id: 1 }, senha: 'errada' }), { statusCode: 400 });
  await assert.rejects(uc.execute({ solicitante: { id: 2 }, senha: 'admin1234' }), { statusCode: 403 });
  await uc.execute({ solicitante: { id: 1 }, senha: 'senha1234' });
  assert.deepEqual(userRepository.excluidos, [1]);
});

test('conta com adoção concluída não pode ser excluída (409)', async () => {
  const userRepository = new FakeUserRepository([{ id: 1, perfil: 'COMUM', senha: 'hash:senha1234' }]);
  userRepository.temAdocao = true;
  const uc = new DeleteAccount({ userRepository, passwordHasher: fakeHasher });

  await assert.rejects(uc.execute({ solicitante: { id: 1 }, senha: 'senha1234' }), { statusCode: 409 });
});

test('administrador não pode alterar o próprio perfil (400)', async () => {
  const userRepository = new FakeUserRepository([{ id: 9, perfil: 'ADMIN' }]);
  const uc = new ChangeUserRole({ userRepository });

  await assert.rejects(uc.execute({ id: 9, solicitante: { id: 9, perfil: 'ADMIN' }, perfil: 'COMUM' }), { statusCode: 400 });
});