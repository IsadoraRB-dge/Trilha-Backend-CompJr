const { Router } = require('express');

const { userController, authenticate } = require('../../../container');
const authorize = require('../middlewares/authorize');

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), userController.list);

module.exports = router;