const MENSAGEM_RECUPERACAO =
  'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir a senha.';

class AuthController {
  constructor({ registerUser, loginUser, getProfile, requestPasswordReset, resetPassword }) {
    this.registerUser = registerUser;
    this.loginUser = loginUser;
    this.getProfile = getProfile;
    this.requestPasswordReset = requestPasswordReset;
    this.resetPasswordUseCase = resetPassword;
  }

  register = async (req, res) => {
    const usuario = await this.registerUser.execute(req.body);
    res.status(201).json(usuario);
  };

  login = async (req, res) => {
    const resultado = await this.loginUser.execute(req.body);
    res.status(200).json(resultado);
  };

  me = async (req, res) => {
    const usuario = await this.getProfile.execute(req.usuario.id);
    res.status(200).json(usuario);
  };

  forgotPassword = async (req, res) => {
    try {
      await this.requestPasswordReset.execute(req.body);
    } catch (err) {

      console.error('Falha ao processar recuperação de senha:', err);
    }
    res.status(200).json({ message: MENSAGEM_RECUPERACAO });
  };

  resetPassword = async (req, res) => {
    await this.resetPasswordUseCase.execute(req.body);
    res.status(200).json({ message: 'Senha redefinida com sucesso. Faça login com a nova senha.' });
  };
}

module.exports = AuthController;