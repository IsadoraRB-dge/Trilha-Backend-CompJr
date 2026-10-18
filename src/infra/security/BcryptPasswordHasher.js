const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

class BcryptPasswordHasher {
  hash(senha) {
    return bcrypt.hash(senha, SALT_ROUNDS);
  }

  compare(senha, hash) {
    return bcrypt.compare(senha, hash);
  }
}

module.exports = BcryptPasswordHasher;