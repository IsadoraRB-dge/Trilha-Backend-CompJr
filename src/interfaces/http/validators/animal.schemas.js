const { z } = require('zod');
const { idParamSchema, paginacao, enumComMensagem } = require('./common.schemas');

const booleano = (campo) => z.boolean({ invalid_type_error: `${campo} deve ser true ou false` });

const nome = z
  .string({ required_error: 'Nome é obrigatório', invalid_type_error: 'Nome deve ser um texto' })
  .trim()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome deve ter no máximo 100 caracteres');

const sexo = enumComMensagem(['M', 'F'], 'Sexo');

const dataNascimento = z
  .string({ invalid_type_error: 'Data de nascimento deve ser um texto no formato AAAA-MM-DD' })
  .date('Data de nascimento deve estar no formato AAAA-MM-DD')
  .transform((valor) => new Date(`${valor}T00:00:00.000Z`))
  .refine((data) => data <= new Date(), 'Data de nascimento não pode estar no futuro');

const descricao = z
  .string({ invalid_type_error: 'Descrição deve ser um texto' })
  .trim()
  .max(1000, 'Descrição deve ter no máximo 1000 caracteres');

const porte = enumComMensagem(['PEQUENO', 'MEDIO', 'GRANDE'], 'Porte');

const dadosCachorro = z.object(
  {
    porte,
    conviveComCachorros: booleano('conviveComCachorros').default(false),
  },
  { required_error: 'Dados de cachorro são obrigatórios', invalid_type_error: 'Dados de cachorro inválidos' },
);

const dadosGato = z.object(
  {
    testadoFivFelv: booleano('testadoFivFelv').default(false),
    conviveComGatos: booleano('conviveComGatos').default(false),
  },
  { required_error: 'Dados de gato são obrigatórios', invalid_type_error: 'Dados de gato inválidos' },
);

const camposComuns = {
  nome,
  sexo,
  dataNascimento: dataNascimento.optional(),
  castrado: booleano('castrado').default(false),
  vacinado: booleano('vacinado').default(false),
  descricao: descricao.optional(),
};

const createAnimalSchema = z.discriminatedUnion(
  'especie',
  [
    z.object({ ...camposComuns, especie: z.literal('CACHORRO'), cachorro: dadosCachorro }),
    z.object({ ...camposComuns, especie: z.literal('GATO'), gato: dadosGato }),
  ],
  { errorMap: () => ({ message: 'Espécie deve ser CACHORRO ou GATO' }) },
);

const updateAnimalSchema = z
  .object({
    nome: nome.optional(),
    sexo: sexo.optional(),
    dataNascimento: dataNascimento.nullable().optional(),
    castrado: booleano('castrado').optional(),
    vacinado: booleano('vacinado').optional(),
    descricao: descricao.nullable().optional(),
    cachorro: z
      .object({
        porte: porte.optional(),
        conviveComCachorros: booleano('conviveComCachorros').optional(),
      })
      .optional(),
    gato: z
      .object({
        testadoFivFelv: booleano('testadoFivFelv').optional(),
        conviveComGatos: booleano('conviveComGatos').optional(),
      })
      .optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, 'Envie pelo menos um campo para alterar');

const listAnimalsQuerySchema = z.object({
  especie: enumComMensagem(['CACHORRO', 'GATO'], 'Espécie').optional(),
  status: enumComMensagem(['DISPONIVEL', 'EM_PROCESSO', 'ADOTADO'], 'Status').optional(),
  sexo: sexo.optional(),
  porte: porte.optional(),
  cidade: z.string().trim().min(1).max(100).optional(),
  uf: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, 'UF deve ter 2 letras')
    .optional(),
  ...paginacao,
});

module.exports = {
  idParamSchema,
  createAnimalSchema,
  updateAnimalSchema,
  listAnimalsQuerySchema,
};