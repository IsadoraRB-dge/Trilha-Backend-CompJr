const env = require('./config/env');
const { prisma } = require('./infra/database/prisma');

const PrismaUserRepository = require('./infra/database/repositories/PrismaUserRepository');
const PrismaPasswordResetRepository = require('./infra/database/repositories/PrismaPasswordResetRepository');
const PrismaAnimalRepository = require('./infra/database/repositories/PrismaAnimalRepository');
const PrismaPedidoRepository = require('./infra/database/repositories/PrismaPedidoRepository');
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

const CreateAnimal = require('./application/use-cases/animais/CreateAnimal');
const ListAnimals = require('./application/use-cases/animais/ListAnimals');
const GetAnimal = require('./application/use-cases/animais/GetAnimal');
const UpdateAnimal = require('./application/use-cases/animais/UpdateAnimal');
const DeleteAnimal = require('./application/use-cases/animais/DeleteAnimal');

const CreateAdoptionRequest = require('./application/use-cases/pedidos/CreateAdoptionRequest');
const ListAdoptionRequests = require('./application/use-cases/pedidos/ListAdoptionRequests');
const GetAdoptionRequest = require('./application/use-cases/pedidos/GetAdoptionRequest');
const UpdateAdoptionRequest = require('./application/use-cases/pedidos/UpdateAdoptionRequest');
const DecideAdoptionRequest = require('./application/use-cases/pedidos/DecideAdoptionRequest');
const CancelAdoptionRequest = require('./application/use-cases/pedidos/CancelAdoptionRequest');

const AuthController = require('./interfaces/http/controllers/AuthController');
const UserController = require('./interfaces/http/controllers/UserController');
const AnimalController = require('./interfaces/http/controllers/AnimalController');
const PedidoController = require('./interfaces/http/controllers/PedidoController');
const makeAuthenticate = require('./interfaces/http/middlewares/authenticate');

// Infraestrutura
const userRepository = new PrismaUserRepository(prisma);
const passwordResetRepository = new PrismaPasswordResetRepository(prisma);
const animalRepository = new PrismaAnimalRepository(prisma);
const pedidoRepository = new PrismaPedidoRepository(prisma);
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

const createAnimal = new CreateAnimal({ animalRepository });
const listAnimals = new ListAnimals({ animalRepository });
const getAnimal = new GetAnimal({ animalRepository });
const updateAnimal = new UpdateAnimal({ animalRepository });
const deleteAnimal = new DeleteAnimal({ animalRepository });

const createAdoptionRequest = new CreateAdoptionRequest({ animalRepository, pedidoRepository });
const listAdoptionRequests = new ListAdoptionRequests({ animalRepository, pedidoRepository });
const getAdoptionRequest = new GetAdoptionRequest({ pedidoRepository });
const updateAdoptionRequest = new UpdateAdoptionRequest({ pedidoRepository });
const decideAdoptionRequest = new DecideAdoptionRequest({ pedidoRepository });
const cancelAdoptionRequest = new CancelAdoptionRequest({ pedidoRepository });

// Interface HTTP
const authController = new AuthController({
  registerUser,
  loginUser,
  getProfile,
  requestPasswordReset,
  resetPassword,
});

const userController = new UserController({ listUsers });

const animalController = new AnimalController({
createAnimal,
  listAnimals,
  getAnimal,
  updateAnimal,
  deleteAnimal,
});

const pedidoController = new PedidoController({
  createAdoptionRequest,
  listAdoptionRequests,
  getAdoptionRequest,
  updateAdoptionRequest,
  decideAdoptionRequest,
  cancelAdoptionRequest,
});
const authenticate = makeAuthenticate({ tokenService, userRepository });

module.exports = {
  authController,
  userController,
  animalController,
  pedidoController,
  authenticate,
  ensureAdminUser,
};