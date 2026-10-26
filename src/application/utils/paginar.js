function paginar({ dados, total, pagina, limite }) {
  return {
    dados,
    paginacao: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
}

module.exports = paginar;