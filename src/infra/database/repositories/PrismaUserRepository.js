const AppError = require('../../../domain/errors/AppError');
const { StatusAnimal, StatusPedido } = require('../../../domain/constants');


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

  update(id, data) {
    return this.prisma.usuario.update({ where: { id }, data });
  }

  updatePassword(id, senhaHash) {
    return this.prisma.usuario.update({
      where: { id },
      data: { senha: senhaHash, senhaAlteradaEm: new Date() },
    });
  }

  deleteAccount(id) {
    return this.prisma.$transaction(async (tx) => {
      const adocoesConcluidas =
        (await tx.animal.count({ where: { usuarioId: id, status: StatusAnimal.ADOTADO } })) +
        (await tx.pedidoAdocao.count({ where: { usuarioId: id, status: StatusPedido.APROVADO } }));

      if (adocoesConcluidas > 0) return false;

      const pendentes = await tx.pedidoAdocao.findMany({
        where: { usuarioId: id, status: StatusPedido.PENDENTE },
        select: { animalId: true },
      });
      const animaisAfetados = [...new Set(pendentes.map((pedido) => pedido.animalId))];

      await tx.pedidoAdocao.deleteMany({ where: { usuarioId: id } });

      await tx.animal.deleteMany({ where: { usuarioId: id } });

      if (animaisAfetados.length > 0) {
        await tx.animal.updateMany({
          where: {
            id: { in: animaisAfetados },
            status: StatusAnimal.EM_PROCESSO,
            pedidos: { none: { status: StatusPedido.PENDENTE } },
          },
          data: { status: StatusAnimal.DISPONIVEL },
        });
      }

      await tx.usuario.delete({ where: { id } });

      return true;
    });
  }
}

module.exports = PrismaUserRepository;