const { Especie } = require('../../../domain/constants');

const INCLUDE = {
  cachorro: true,
  gato: true,
  dono: { select: { id: true, nome: true, cidade: true, uf: true } },
};

class PrismaAnimalRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  create({ usuarioId, dados, especie, especificos }) {
    return this.prisma.animal.create({
      data: {
        ...dados,
        usuarioId,
        ...(especie === Especie.CACHORRO
          ? { cachorro: { create: especificos } }
          : { gato: { create: especificos } }),
      },
      include: INCLUDE,
    });
  }

  findById(id) {
    return this.prisma.animal.findUnique({ where: { id }, include: INCLUDE });
  }

  async list({ filtros, pagina, limite }) {
    const where = this.montarFiltros(filtros);

    const [total, dados] = await this.prisma.$transaction([
      this.prisma.animal.count({ where }),
      this.prisma.animal.findMany({
        where,
        include: INCLUDE,
        orderBy: { criadoEm: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
    ]);

    return { dados, total };
  }

  update(id, { dados, cachorro, gato }) {
    return this.prisma.animal.update({
      where: { id },
      data: {
        ...dados,
        ...(cachorro && { cachorro: { update: cachorro } }),
        ...(gato && { gato: { update: gato } }),
      },
      include: INCLUDE,
    });
  }

  delete(id) {
    return this.prisma.animal.delete({ where: { id } });
  }

  montarFiltros({ especie, status, sexo, porte, cidade, uf }) {
    const where = {};

    if (status) where.status = status;
    if (sexo) where.sexo = sexo;

    if (especie === Especie.CACHORRO) where.cachorro = { isNot: null };
    if (especie === Especie.GATO) where.gato = { isNot: null };

    if (porte) where.cachorro = { is: { porte } };

    if (cidade || uf) {
      where.dono = {
        ...(cidade && { cidade: { equals: cidade, mode: 'insensitive' } }),
        ...(uf && { uf }),
      };
    }

    return where;
  }
}

module.exports = PrismaAnimalRepository;