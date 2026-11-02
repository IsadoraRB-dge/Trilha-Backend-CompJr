const { Router } = require('express');

const { userController, authenticate } = require('../../../container');
const validate = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
const { idParamSchema } = require('../validators/common.schemas');
const {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  changeRoleSchema,
} = require('../validators/usuario.schemas');

const router = Router();

router.use(authenticate);
router.patch('/me', validate(updateProfileSchema), userController.updateMe);
router.patch('/me/senha', validate(changePasswordSchema), userController.changePassword);
router.delete('/me', validate(deleteAccountSchema), userController.deleteMe);
router.get('/', authorize('ADMIN'), userController.list);
router.get('/:id', authorize('ADMIN'), validate(idParamSchema, 'params'), userController.get);
router.patch(
  '/:id/perfil',
  authorize('ADMIN'),
  validate(idParamSchema, 'params'),
  validate(changeRoleSchema),
  userController.changeRole,
);
router.delete('/:id', authorize('ADMIN'), validate(idParamSchema, 'params'), userController.remove);

module.exports = router;