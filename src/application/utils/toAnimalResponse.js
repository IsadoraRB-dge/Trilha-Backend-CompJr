const { Especie } = require('../../domain/constants');

function toAnimalResponse(animal) {
  if (!animal) return null;

  const { cachorro, gato, usuarioId, ...dados } = animal;

  const resposta = {
    ...dados,
    especie: cachorro ? Especie.CACHORRO : Especie.GATO,
  };

  if (cachorro) {
    resposta.cachorro = {
      porte: cachorro.porte,
      conviveComCachorros: cachorro.conviveComCachorros,
    };
  }

  if (gato) {
    resposta.gato = {
      testadoFivFelv: gato.testadoFivFelv,
      conviveComGatos: gato.conviveComGatos,
    };
  }

  return resposta;
}

module.exports = toAnimalResponse;