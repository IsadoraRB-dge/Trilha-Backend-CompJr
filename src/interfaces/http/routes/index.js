const { Router } = require('express');

const AppError = require('../../../domain/errors/AppError');
const { checkDatabaseConnection } = require('../../../infra/database/prisma');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const animalRoutes = require('./animal.routes');
const pedidoRoutes = require('./pedido.routes');


const router = Router();

router.get('/health', async (req, res) => {
  try {
    await checkDatabaseConnection();
  } catch {
    throw new AppError('Banco de dados indisponível', 503);
  }

  res.status(200).json({ status: 'ok', database: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/animais', animalRoutes);
router.use('/pedidos', pedidoRoutes);

module.exports = router;