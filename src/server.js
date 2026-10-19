const app = require('./app');
const env = require('./config/env');
const { prisma } = require('./infra/database/prisma');
const { ensureAdminUser } = require('./container');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  await ensureAdminUser.execute(env.admin);

  const server = app.listen(env.port, () => {
    console.log(`API rodando na porta ${env.port}`);
  });

async function encerrar() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);

}

iniciar().catch(async (err) => {
  console.error('Falha ao iniciar a API:', err);
  await prisma.$disconnect();
  process.exit(1);
});