require('dotenv/config');
const env = {
  port: Number(process.env.PORT) || 3000,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',

  resetTokenExpiresMinutes: Number(process.env.RESET_TOKEN_EXPIRES_MINUTES) || 15,

  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT) || 1025,
    user: process.env.SMTP_USER || undefined,
    pass: process.env.SMTP_PASS || undefined,
  },
  mailFrom: process.env.MAIL_FROM || 'Adoção de Animais <nao-responda@adocao.local>',

  viaCepUrl: process.env.VIACEP_URL || 'https://viacep.com.br/ws',

  admin: {
    nome: process.env.ADMIN_NAME || 'Administrador',
    email: process.env.ADMIN_EMAIL,
    senha: process.env.ADMIN_PASSWORD,
    cep: process.env.ADMIN_CEP || '37200000',
    cidade: process.env.ADMIN_CIDADE || 'Lavras',
    uf: process.env.ADMIN_UF || 'MG',
  },
};

if (!env.jwtSecret) {
  throw new Error('A variável de ambiente JWT_SECRET não foi definida. Confira o arquivo .env.');
}

module.exports = env;