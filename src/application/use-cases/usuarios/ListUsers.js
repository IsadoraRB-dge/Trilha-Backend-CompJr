const toPublicUser = require('../../utils/toPublicUser');

class ListUsers {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute() {
    const usuarios = await this.userRepository.list();
    return usuarios.map(toPublicUser);
  }
}

module.exports = ListUsers;