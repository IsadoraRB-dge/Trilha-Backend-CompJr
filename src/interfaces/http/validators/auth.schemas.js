const { z } = require('zod');

const texto = (campo, genero = 'o') =>
  z.string({
    required_error: `${campo} é obrigatóri${genero}`,
    invalid_type_error: `${campo} deve ser um texto`,
  });

const email = texto('E-mail')
  .trim()
  .toLowerCase()
  .email('E-mail inválido')
  .max(150, 'E-mail deve ter no máximo 150 caracteres');

const senha = (campo) =>
  texto(campo, 'a')
    .min(8, `${campo} deve ter pelo menos 8 caracteres`)
    .max(72, `${campo} deve ter no máximo 72 caracteres`);

const registerSchema = z.object({
  nome: texto('Nome')
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email,
  senha: senha('Senha'),
  cep: texto('CEP')
    .trim()
    .transform((valor) => valor.replace('-', ''))
    .pipe(z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos')),
});

const loginSchema = z.object({
  email,
  senha: texto('Senha', 'a').min(1, 'Senha é obrigatória'),
});

const forgotPasswordSchema = z.object({
  email,
});

const resetPasswordSchema = z.object({
  token: texto('Código').trim().min(1, 'Código é obrigatório'),
  novaSenha: senha('Nova senha'),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};