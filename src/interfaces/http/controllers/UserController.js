class UserController {
  constructor({ listUsers, getUser, updateProfile, changePassword, deleteAccount, deleteUser, changeUserRole }) {
    this.listUsers = listUsers;
    this.getUser = getUser;
    this.updateProfile = updateProfile;
    this.changePasswordUseCase = changePassword;
    this.deleteAccount = deleteAccount;
    this.deleteUser = deleteUser;
    this.changeUserRole = changeUserRole;
  }

  updateMe = async (req, res) => {
    const usuario = await this.updateProfile.execute({ solicitante: req.usuario, ...req.body });
    res.status(200).json(usuario);
  };

  changePassword = async (req, res) => {
    await this.changePasswordUseCase.execute({ solicitante: req.usuario, ...req.body });
    res.status(200).json({ message: 'Senha alterada com sucesso. Faça login novamente com a nova senha.' });
  };

  deleteMe = async (req, res) => {
    await this.deleteAccount.execute({ solicitante: req.usuario, senha: req.body.senha });
    res.status(204).send();
  };


  list = async (req, res) => {
    const usuarios = await this.listUsers.execute();
    res.status(200).json(usuarios);
  };

  get = async (req, res) => {
    const usuario = await this.getUser.execute(req.validado.params.id);
    res.status(200).json(usuario);
  };

  changeRole = async (req, res) => {
    const usuario = await this.changeUserRole.execute({
      id: req.validado.params.id,
      solicitante: req.usuario,
      perfil: req.body.perfil,
    });
    res.status(200).json(usuario);
  };

  remove = async (req, res) => {
    await this.deleteUser.execute(req.validado.params.id);
    res.status(204).send();
  };
}

module.exports = UserController;