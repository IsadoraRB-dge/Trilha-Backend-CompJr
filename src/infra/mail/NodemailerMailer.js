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

  enviar({ para, assunto, linhas }) {
    return this.transporter.sendMail({
      from: this.from,
      to: para,
      subject: assunto,
      text: linhas.join('\n'),
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

  async sendDecisaoPedido({ para, nomeAdotante, nomeAnimal, aprovado }) {
    await this.enviar({
      para,
      assunto: aprovado
        ? `Seu pedido para adotar ${nomeAnimal} foi aprovado!`
        : `Atualização sobre o seu pedido para adotar ${nomeAnimal}`,
      linhas: aprovado
        ? [
            `Oii, ${nomeAdotante}!`,
            '',
            `Seu pedido para adotar ${nomeAnimal} foi aprovado. O dono do animal vai entrar em contato pelo seu e-mail.`,
          ]
        : [
            `Oii, ${nomeAdotante}!`,
            '',
            `Infelizmente, seu pedido para adotar ${nomeAnimal} foi recusado.`,
            'Há outros animais esperando por um lar: consulte GET /animais?status=DISPONIVEL.',
          ],
    });
  }
}

module.exports = NodemailerMailer;