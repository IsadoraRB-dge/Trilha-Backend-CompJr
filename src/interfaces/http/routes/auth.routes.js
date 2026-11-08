const { Router } = require('express');

const { authController, authenticate } = require('../../../container');
const validate = require('../middlewares/validate');
const { loginLimiter, cadastroLimiter, recuperacaoLimiter } = require('../middlewares/rateLimiters');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/auth.schemas');

const router = Router();

router.post('/register',  cadastroLimiter, validate(registerSchema), authController.register);
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.me);
router.post('/forgot-password', recuperacaoLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', recuperacaoLimiter, validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;