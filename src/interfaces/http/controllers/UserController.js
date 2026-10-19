class UserController {
  constructor({ listUsers }) {
    this.listUsers = listUsers;
  }

  list = async (req, res) => {
    const usuarios = await this.listUsers.execute();
    res.status(200).json(usuarios);
  };
}

module.exports = UserController;