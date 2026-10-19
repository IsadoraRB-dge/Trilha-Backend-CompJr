class PrismaPasswordResetRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  invalidateAllForUser(usuarioId) {
    return this.prisma.tokenRecuperacaoSenha.updateMany({
      where: { usuarioId, usadoEm: null },
      data: { usadoEm: new Date() },
    });
  }

  create({ usuarioId, tokenHash, expiraEm }) {
    return this.prisma.tokenRecuperacaoSenha.create({
      data: { usuarioId, tokenHash, expiraEm },
    });
  }

  findByHash(tokenHash) {
    return this.prisma.tokenRecuperacaoSenha.findUnique({ where: { tokenHash } });
  }

  resetPassword({ tokenId, usuarioId, senhaHash }) {
    return this.prisma.$transaction(async (tx) => {
      const agora = new Date();

      const { count } = await tx.tokenRecuperacaoSenha.updateMany({
        where: { id: tokenId, usadoEm: null, expiraEm: { gt: agora } },
        data: { usadoEm: agora },
      });

      if (count === 0) return false;

      await tx.usuario.update({
        where: { id: usuarioId },
        data: { senha: senhaHash, senhaAlteradaEm: agora },
      });

      await tx.tokenRecuperacaoSenha.updateMany({
        where: { usuarioId, usadoEm: null },
        data: { usadoEm: agora },
      });

      return true;
    });
  }
}

module.exports = PrismaPasswordResetRepository;