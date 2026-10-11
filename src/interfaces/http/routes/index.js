const { Router } = require('express');

const AppError = require('../../../domain/errors/AppError');
const { checkDatabaseConnection } = require('../../../infra/database/prisma');

const router = Router();

router.get('/health', async (req, res) => {
  try {
    await checkDatabaseConnection();
  } catch {
    throw new AppError('Banco de dados indisponível', 503);
  }

  res.status(200).json({ status: 'ok', database: 'ok' });
});

module.exports = router;