const AppError = require('../../../domain/errors/AppError');

class PrismaUserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findByEmail(email) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  findById(id) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async create(data) {
    try {
      return await this.prisma.usuario.create({ data });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new AppError('E-mail já cadastrado', 409);
      }
      throw err;
    }
  }

  list() {
    return this.prisma.usuario.findMany({ orderBy: { id: 'asc' } });
  }
}

module.exports = PrismaUserRepository;