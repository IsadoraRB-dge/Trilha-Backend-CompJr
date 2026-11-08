/**
 * Cria dados de exemplo para testar a API rapidamente:
 * 3 usuários, 4 animais (cães e gatos) e pedidos de adoção em situações diferentes.
 *
 * Uso (com o ambiente no ar): docker compose exec api npm run seed
 * Pode ser executado mais de uma vez: se os dados já existirem, nada é feito.
 */
require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const SENHA_PADRAO = 'senha12345';

async function main() {
  const jaExiste = await prisma.usuario.findUnique({ where: { email: 'ana@exemplo.com' } });
  if (jaExiste) {
    console.log('Os dados de exemplo já existem. Nada foi alterado.');
    return;
  }

  const senha = await bcrypt.hash(SENHA_PADRAO, 10);

  await prisma.$transaction(async (tx) => {
    // ---------- Usuários ----------
    const ana = await tx.usuario.create({
      data: {
        nome: 'Ana Souza',
        email: 'ana@exemplo.com',
        senha,
        cep: '01001000',
        logradouro: 'Praça da Sé',
        bairro: 'Sé',
        cidade: 'São Paulo',
        uf: 'SP',
      },
    });

    const bruno = await tx.usuario.create({
      data: {
        nome: 'Bruno Lima',
        email: 'bruno@exemplo.com',
        senha,
        cep: '37200000',
        cidade: 'Lavras',
        uf: 'MG',
      },
    });

    const carla = await tx.usuario.create({
      data: {
        nome: 'Carla Dias',
        email: 'carla@exemplo.com',
        senha,
        cep: '30130010',
        logradouro: 'Praça Sete de Setembro',
        bairro: 'Centro',
        cidade: 'Belo Horizonte',
        uf: 'MG',
      },
    });

    // ---------- Animais ----------
    const Rakan = await tx.animal.create({
      data: {
        usuarioId: ana.id,
        nome: 'Rakan',
        sexo: 'M',
        dataNascimento: new Date('2022-03-15'),
        castrado: true,
        vacinado: true,
        descricao: 'Dócil, brincalhão e acostumado com crianças.',
        status: 'EM_PROCESSO',
        cachorro: { create: { porte: 'GRANDE', conviveComCachorros: true } },
      },
    });

    await tx.animal.create({
      data: {
        usuarioId: ana.id,
        nome: 'Zoe',
        sexo: 'F',
        dataNascimento: new Date('2023-08-01'),
        vacinado: true,
        descricao: 'Tranquila e carinhosa. Gosta de colo.',
        gato: { create: { testadoFivFelv: true, conviveComGatos: true } },
      },
    });

    await tx.animal.create({
      data: {
        usuarioId: bruno.id,
        nome: 'Thor',
        sexo: 'M',
        castrado: true,
        descricao: 'Pequeno e cheio de energia.',
        cachorro: { create: { porte: 'PEQUENO', conviveComCachorros: false } },
      },
    });

    const luna = await tx.animal.create({
      data: {
        usuarioId: bruno.id,
        nome: 'Luna',
        sexo: 'F',
        castrado: true,
        vacinado: true,
        descricao: 'Independente e curiosa.',
        status: 'ADOTADO',
        gato: { create: { testadoFivFelv: true, conviveComGatos: false } },
      },
    });

    // ---------- Pedidos ----------
    // Pedido pendente: a Ana pode aprovar ou recusar
    await tx.pedidoAdocao.create({
      data: {
        usuarioId: carla.id,
        animalId: Rakan.id,
        motivo: 'Moro em casa com quintal grande e trabalho de casa.',
      },
    });

    // Adoção já concluída: mostra o histórico protegido
    await tx.pedidoAdocao.create({
      data: {
        usuarioId: carla.id,
        animalId: luna.id,
        status: 'APROVADO',
        motivo: 'Sempre tive gatos e tenho as janelas teladas.',
      },
    });
  });

  console.log('Dados de exemplo criados. Usuários (senha: senha12345):');
  console.log('- ana@exemplo.com   (dona do Rakan e da Zoe; tem um pedido pendente para responder)');
  console.log('- bruno@exemplo.com (dono do Thor e da Luna)');
  console.log('- carla@exemplo.com (pediu o Rakan e já adotou a Luna)');
}

main()
  .catch((err) => {
    console.error('Falha ao criar os dados de exemplo:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());