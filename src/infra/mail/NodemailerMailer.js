const nodemailer = require('nodemailer');

class NodemailerMailer {
  constructor({ host, port, user, pass, from }) {
    this.from = from;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user ? { user, pass } : undefined,
    });
  }

  async sendPasswordReset({ para, nome, token, expiresMinutes }) {
    await this.transporter.sendMail({
      from: this.from,
      to: para,
      subject: 'Recuperação de senha',
      text: [
        `Oii, ${nome}!`,
        '',
        'Foi relaizado um pedido para redefinir a sua senha.',
        `Use o código abaixo em até ${expiresMinutes} minutos:`,
        '',
        token,
        '',
        'Envie o código para POST /auth/reset-password, junto com a nova senha.',
        'Se você não pediu a recuperação, ignore este e-mail. Sua senha continua a mesma.',
      ].join('\n'),
    });
  }
}

module.exports = NodemailerMailer;