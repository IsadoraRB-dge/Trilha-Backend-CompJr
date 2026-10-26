const { Router } = require('express');

const { animalController, pedidoController, authenticate } = require('../../../container');
const validate = require('../middlewares/validate');
const {
  idParamSchema,
  createAnimalSchema,
  updateAnimalSchema,
  listAnimalsQuerySchema,
} = require('../validators/animal.schemas');
const { pedidoSchema, listPedidosQuerySchema } = require('../validators/pedido.schemas');

const router = Router();

router.get('/', validate(listAnimalsQuerySchema, 'query'), animalController.list);
router.get('/:id', validate(idParamSchema, 'params'), animalController.get);

router.post('/', authenticate, validate(createAnimalSchema), animalController.create);
router.patch(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  validate(updateAnimalSchema),
  animalController.update,
);
router.delete('/:id', authenticate, validate(idParamSchema, 'params'), animalController.remove);

router.post(
  '/:id/pedidos',
  authenticate,
  validate(idParamSchema, 'params'),
  validate(pedidoSchema),
  pedidoController.create,
);
router.get(
  '/:id/pedidos',
  authenticate,
  validate(idParamSchema, 'params'),
  validate(listPedidosQuerySchema, 'query'),
  pedidoController.listByAnimal,
);

module.exports = router;