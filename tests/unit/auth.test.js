const { test } = require('node:test');
const assert = require('node:assert/strict');

const RegisterUser = require('../../src/application/use-cases/auth/RegisterUser');
const LoginUser = require('../../src/application/use-cases/auth/LoginUser');
const ResetPassword = require('../../src/application/use-cases/auth/ResetPassword');
const { FakeUserRepository, fakeHasher, fakeCepService, fakeTokenService } = require('./fakes');

test('cadastro cria usuário COMUM, com endereço do CEP e sem devolver a senha', async () => {
  const userRepository = new FakeUserRepository();
  const registerUser = new RegisterUser({ userRepository, passwordHasher: fakeHasher, cepService: fakeCepService });

  const usuario = await registerUser.execute({ nome: 'Ana', email: 'ana@gmail.com', senha: 'senha1234', cep: '37200000' });

  assert.equal(usuario.perfil, 'COMUM');
  assert.equal(usuario.cidade, 'Lavras');
  assert.equal(usuario.senha, undefined);
  assert.equal(userRepository.usuarios[0].senha, 'hash:senha1234');
});

test('cadastro com e-mail repetido retorna 409', async () => {
  const userRepository = new FakeUserRepository([{ id: 1, email: 'ana@gmail.com' }]);
  const registerUser = new RegisterUser({ userRepository, passwordHasher: fakeHasher, cepService: fakeCepService });

  await assert.rejects(
    registerUser.execute({ nome: 'Ana', email: 'ana@gmail.com', senha: 'senha1234', cep: '37200000' }),
    { statusCode: 409 },
  );
});

test('login usa a mesma mensagem para e-mail inexistente e senha errada', async () => {
  const userRepository = new FakeUserRepository([{ id: 1, email: 'ana@gmail.com', senha: 'hash:certa1234', perfil: 'COMUM' }]);
  const loginUser = new LoginUser({ userRepository, passwordHasher: fakeHasher, tokenService: fakeTokenService });

  const semEmail = await loginUser.execute({ email: 'outro@gmail.com', senha: 'x' }).catch((e) => e);
  const senhaErrada = await loginUser.execute({ email: 'ana@gmail.com', senha: 'errada' }).catch((e) => e);

  assert.equal(semEmail.statusCode, 401);
  assert.equal(senhaErrada.statusCode, 401);
  assert.equal(semEmail.message, senhaErrada.message);
});

test('código de recuperação expirado ou já usado é recusado', async () => {
  const gerador = { hash: (token) => `h:${token}` };
  const registros = {
    'h:expirado': { id: 1, usuarioId: 1, usadoEm: null, expiraEm: new Date(Date.now() - 1000) },
    'h:usado': { id: 2, usuarioId: 1, usadoEm: new Date(), expiraEm: new Date(Date.now() + 60000) },
  };
  const passwordResetRepository = {
    findByHash: async (hash) => registros[hash] || null,
    resetPassword: async () => true,
  };
  const resetPassword = new ResetPassword({ passwordResetRepository, passwordHasher: fakeHasher, resetTokenGenerator: gerador });

  for (const token of ['expirado', 'usado', 'inexistente']) {
    await assert.rejects(resetPassword.execute({ token, novaSenha: 'nova12345' }), { statusCode: 400 });
  }
});