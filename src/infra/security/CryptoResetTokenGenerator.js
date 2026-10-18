const crypto = require('node:crypto');

class CryptoResetTokenGenerator {
  generate() {
    const token = crypto.randomBytes(32).toString('hex');
    return { token, tokenHash: this.hash(token) };
  }

  hash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

module.exports = CryptoResetTokenGenerator;