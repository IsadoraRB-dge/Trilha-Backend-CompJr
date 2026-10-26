const { Router } = require('express');

const { pedidoController, authenticate } = require('../../../container');
const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const { idParamSchema } = require('../validators/common.schemas');
const { pedidoSchema, listPedidosQuerySchema } = require('../validators/pedido.schemas');

const router = Router();

router.use(authenticate);

router.get('/meus', validate(listPedidosQuerySchema, 'query'), pedidoController.listMine);
router.get('/', authorize('ADMIN'), validate(listPedidosQuerySchema, 'query'), pedidoController.listAll);
router.get('/:id', validate(idParamSchema, 'params'), pedidoController.get);
router.patch('/:id', validate(idParamSchema, 'params'), validate(pedidoSchema), pedidoController.update);
router.patch('/:id/aprovar', validate(idParamSchema, 'params'), pedidoController.approve);
router.patch('/:id/recusar', validate(idParamSchema, 'params'), pedidoController.reject);
router.patch('/:id/cancelar', validate(idParamSchema, 'params'), pedidoController.cancel);

module.exports = router;