const { test } = require('node:test');
const assert = require('node:assert/strict');

const AddAnimalPhoto = require('../../src/application/use-cases/animais/AddAnimalPhoto');
const RemoveAnimalPhoto = require('../../src/application/use-cases/animais/RemoveAnimalPhoto');

const dono = { id: 1, perfil: 'COMUM' };
const outro = { id: 2, perfil: 'COMUM' };
const arquivo = { buffer: Buffer.from('imagem') };

function criarCenario({ configurado = true, statusAnimal = 'DISPONIVEL', quantidade = 0 } = {}) {
  const animal = { id: 10, usuarioId: dono.id, status: statusAnimal };
  const removidos = [];

  const animalRepository = { findById: async (id) => (id === animal.id ? animal : null) };
  const fotoRepository = {
    countByAnimal: async () => quantidade,
    create: async (dados) => ({ id: 99, url: dados.url }),
    findById: async (id) => (id === 99 ? { id: 99, animalId: 10, publicId: 'pasta/foto' } : null),
    delete: async () => {},
  };
  const imageStorage = {
    configurado,
    upload: async () => ({ url: 'https://res.cloudinary.com/foto.jpg', publicId: 'pasta/foto' }),
    remove: async (publicId) => removidos.push(publicId),
  };

  return { animalRepository, fotoRepository, imageStorage, removidos };
}

test('sem Cloudinary configurado, o envio de fotos responde 503', async () => {
  const uc = new AddAnimalPhoto(criarCenario({ configurado: false }));

  await assert.rejects(uc.execute({ animalId: 10, solicitante: dono, arquivo }), { statusCode: 503 });
});

test('o dono envia a foto e recebe o link', async () => {
  const uc = new AddAnimalPhoto(criarCenario());

  const foto = await uc.execute({ animalId: 10, solicitante: dono, arquivo });

  assert.equal(foto.url, 'https://res.cloudinary.com/foto.jpg');
});

test('só o dono ou o admin enviam fotos, e no máximo 5 por animal', async () => {
  await assert.rejects(
    new AddAnimalPhoto(criarCenario()).execute({ animalId: 10, solicitante: outro, arquivo }),
    { statusCode: 403 },
  );
  await assert.rejects(
    new AddAnimalPhoto(criarCenario({ quantidade: 5 })).execute({ animalId: 10, solicitante: dono, arquivo }),
    { statusCode: 409 },
  );
});

test('remover a foto apaga também o arquivo no Cloudinary', async () => {
  const cenario = criarCenario();
  const uc = new RemoveAnimalPhoto(cenario);

  await uc.execute({ animalId: 10, fotoId: 99, solicitante: dono });

  assert.deepEqual(cenario.removidos, ['pasta/foto']);
  await assert.rejects(uc.execute({ animalId: 10, fotoId: 123, solicitante: dono }), { statusCode: 404 });
});