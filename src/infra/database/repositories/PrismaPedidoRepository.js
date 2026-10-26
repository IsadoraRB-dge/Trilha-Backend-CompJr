const { StatusAnimal, StatusPedido } = require('../../../domain/constants');

const INCLUDE = {
  animal: { select: { id: true, nome: true, status: true, usuarioId: true } },
  adotante: { select: { id: true, nome: true, email: true, cidade: true, uf: true } },
};

class PrismaPedidoRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findById(id) {
    return this.prisma.pedidoAdocao.findUnique({ where: { id }, include: INCLUDE });
  }

  findPendente({ usuarioId, animalId }) {
    return this.prisma.pedidoAdocao.findFirst({
      where: { usuarioId, animalId, status: StatusPedido.PENDENTE },
    });
  }

  create({ usuarioId, animalId, motivo }) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.animal.updateMany({
        where: { id: animalId, status: { in: [StatusAnimal.DISPONIVEL, StatusAnimal.EM_PROCESSO] } },
        data: { status: StatusAnimal.EM_PROCESSO },
      });

      if (count === 0) return null;

      return tx.pedidoAdocao.create({
        data: { usuarioId, animalId, motivo },
        include: INCLUDE,
      });
    });
  }

  async list({ filtros, pagina, limite }) {
    const where = {};
    if (filtros.status) where.status = filtros.status;
    if (filtros.usuarioId) where.usuarioId = filtros.usuarioId;
    if (filtros.animalId) where.animalId = filtros.animalId;

    const [total, dados] = await this.prisma.$transaction([
      this.prisma.pedidoAdocao.count({ where }),
      this.prisma.pedidoAdocao.findMany({
        where,
        include: INCLUDE,
        orderBy: { criadoEm: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
    ]);

    return { dados, total };
  }

  async updateMotivo(id, motivo) {
    const { count } = await this.prisma.pedidoAdocao.updateMany({
      where: { id, status: StatusPedido.PENDENTE },
      data: { motivo },
    });

    return count === 0 ? null : this.findById(id);
  }

  approve({ id, animalId }) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.pedidoAdocao.updateMany({
        where: { id, status: StatusPedido.PENDENTE },
        data: { status: StatusPedido.APROVADO },
      });

      if (count === 0) return false;

      await tx.pedidoAdocao.updateMany({
        where: { animalId, status: StatusPedido.PENDENTE, id: { not: id } },
        data: { status: StatusPedido.RECUSADO },
      });

      await tx.animal.update({
        where: { id: animalId },
        data: { status: StatusAnimal.ADOTADO },
      });

      return true;
    });
  }

  close({ id, animalId, status }) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.pedidoAdocao.updateMany({
        where: { id, status: StatusPedido.PENDENTE },
        data: { status },
      });

      if (count === 0) return false;

      const pendentes = await tx.pedidoAdocao.count({
        where: { animalId, status: StatusPedido.PENDENTE },
      });

      if (pendentes === 0) {
        await tx.animal.updateMany({
          where: { id: animalId, status: StatusAnimal.EM_PROCESSO },
          data: { status: StatusAnimal.DISPONIVEL },
        });
      }

      return true;
    });
  }
}

module.exports = PrismaPedidoRepository;