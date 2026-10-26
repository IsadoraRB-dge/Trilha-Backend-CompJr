const { z } = require('zod');

const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'ID inválido' })
    .int('ID inválido')
    .positive('ID inválido'),
});

const paginacao = {
  pagina: z.coerce.number().int('Página inválida').min(1, 'Página deve ser no mínimo 1').default(1),
  limite: z.coerce
    .number()
    .int('Limite inválido')
    .min(1, 'Limite deve ser no mínimo 1')
    .max(50, 'Limite deve ser no máximo 50')
    .default(10),
};

function enumComMensagem(valores, campo) {
  return z.enum(valores, {
    errorMap: () => ({ message: `${campo} deve ser um destes valores: ${valores.join(', ')}` }),
  });
}

module.exports = { idParamSchema, paginacao, enumComMensagem };