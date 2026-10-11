require('dotenv/config');

const app = require('./app');
const { prisma } = require('./infra/database/prisma');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

async function encerrar() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);