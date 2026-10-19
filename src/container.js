const env = require('./config/env');
const { prisma } = require('./infra/database/prisma');

const PrismaUserRepository = require('./infra/database/repositories/PrismaUserRepository');
const PrismaPasswordResetRepository = require('./infra/database/repositories/PrismaPasswordResetRepository');
const BcryptPasswordHasher = require('./infra/security/BcryptPasswordHasher');
const JwtTokenService = require('./infra/security/JwtTokenService');
const CryptoResetTokenGenerator = require('./infra/security/CryptoResetTokenGenerator');
const NodemailerMailer = require('./infra/mail/NodemailerMailer');
const ViaCepService = require('./infra/cep/ViaCepService');

const RegisterUser = require('./application/use-cases/auth/RegisterUser');
const LoginUser = require('./application/use-cases/auth/LoginUser');
const GetProfile = require('./application/use-cases/auth/GetProfile');
const RequestPasswordReset = require('./application/use-cases/auth/RequestPasswordReset');
const ResetPassword = require('./application/use-cases/auth/ResetPassword');
const EnsureAdminUser = require('./application/use-cases/auth/EnsureAdminUser');
const ListUsers = require('./application/use-cases/usuarios/ListUsers');

const AuthController = require('./interfaces/http/controllers/AuthController');
const UserController = require('./interfaces/http/controllers/UserController');
const makeAuthenticate = require('./interfaces/http/middlewares/authenticate');

// Infraestrutura
const userRepository = new PrismaUserRepository(prisma);
const passwordResetRepository = new PrismaPasswordResetRepository(prisma);
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService({ secret: env.jwtSecret, expiresIn: env.jwtExpiresIn });
const resetTokenGenerator = new CryptoResetTokenGenerator();
const mailer = new NodemailerMailer({ ...env.smtp, from: env.mailFrom });
const cepService = new ViaCepService({ baseUrl: env.viaCepUrl });

// Casos de uso
const registerUser = new RegisterUser({ userRepository, passwordHasher, cepService });
const loginUser = new LoginUser({ userRepository, passwordHasher, tokenService });
const getProfile = new GetProfile({ userRepository });
const requestPasswordReset = new RequestPasswordReset({
  userRepository,
  passwordResetRepository,
  resetTokenGenerator,
  mailer,
  expiresMinutes: env.resetTokenExpiresMinutes,
});
const resetPassword = new ResetPassword({ passwordResetRepository, passwordHasher, resetTokenGenerator });
const ensureAdminUser = new EnsureAdminUser({ userRepository, passwordHasher });
const listUsers = new ListUsers({ userRepository });

// Interface HTTP
const authController = new AuthController({
  registerUser,
  loginUser,
  getProfile,
  requestPasswordReset,
  resetPassword,
});
const userController = new UserController({ listUsers });
const authenticate = makeAuthenticate({ tokenService, userRepository });

module.exports = {
  authController,
  userController,
  authenticate,
  ensureAdminUser,
};