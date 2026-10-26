const { z } = require('zod');
const { paginacao, enumComMensagem } = require('./common.schemas');

const motivo = z
  .string({ required_error: 'Motivo é obrigatório', invalid_type_error: 'Motivo deve ser um texto' })
  .trim()
  .min(10, 'Motivo deve ter pelo menos 10 caracteres')
  .max(1000, 'Motivo deve ter no máximo 1000 caracteres');

const pedidoSchema = z.object({ motivo });

const listPedidosQuerySchema = z.object({
  status: enumComMensagem(['PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO'], 'Status').optional(),
  ...paginacao,
});

module.exports = { pedidoSchema, listPedidosQuerySchema };