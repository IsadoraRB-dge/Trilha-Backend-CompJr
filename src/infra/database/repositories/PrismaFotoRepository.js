class PrismaFotoRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  countByAnimal(animalId) {
    return this.prisma.fotoAnimal.count({ where: { animalId } });
  }

  create({ animalId, url, publicId }) {
    return this.prisma.fotoAnimal.create({
      data: { animalId, url, publicId },
      select: { id: true, url: true },
    });
  }

  findById(id) {
    return this.prisma.fotoAnimal.findUnique({ where: { id } });
  }

  delete(id) {
    return this.prisma.fotoAnimal.delete({ where: { id } });
  }
}

module.exports = PrismaFotoRepository;