const { z } = require('zod');
const { enumComMensagem } = require('./common.schemas');

const senha = (campo) =>
  z
    .string({ required_error: `${campo} é obrigatória`, invalid_type_error: `${campo} deve ser um texto` })
    .min(8, `${campo} deve ter pelo menos 8 caracteres`)
    .max(72, `${campo} deve ter no máximo 72 caracteres`);

const updateProfileSchema = z
  .object({
    nome: z
      .string({ invalid_type_error: 'Nome deve ser um texto' })
      .trim()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres')
      .optional(),
    cep: z
      .string({ invalid_type_error: 'CEP deve ser um texto' })
      .trim()
      .transform((valor) => valor.replace('-', ''))
      .pipe(z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos'))
      .optional(),
  })
  .refine((dados) => dados.nome !== undefined || dados.cep !== undefined, 'Envie o nome ou o CEP para alterar');

const changePasswordSchema = z.object({
  senhaAtual: z
    .string({ required_error: 'Senha atual é obrigatória', invalid_type_error: 'Senha atual deve ser um texto' })
    .min(1, 'Senha atual é obrigatória'),
  novaSenha: senha('Nova senha'),
});

const deleteAccountSchema = z.object({
  senha: z
    .string({ required_error: 'Senha é obrigatória para excluir a conta', invalid_type_error: 'Senha deve ser um texto' })
    .min(1, 'Senha é obrigatória para excluir a conta'),
});

const changeRoleSchema = z.object({
  perfil: enumComMensagem(['COMUM', 'ADMIN'], 'Perfil'),
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  changeRoleSchema,
};