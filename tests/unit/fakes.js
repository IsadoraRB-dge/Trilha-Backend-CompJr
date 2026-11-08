class FakeUserRepository {
  constructor(usuarios = []) {
    this.usuarios = usuarios;
    this.excluidos = [];
    this.temAdocao = false;
  }

  async findByEmail(email) {
    return this.usuarios.find((u) => u.email === email) || null;
  }

  async findById(id) {
    return this.usuarios.find((u) => u.id === id) || null;
  }

  async create(data) {
    const usuario = { id: this.usuarios.length + 1, ...data };
    this.usuarios.push(usuario);
    return usuario;
  }

  async update(id, data) {
    const usuario = await this.findById(id);
    Object.assign(usuario, data);
    return usuario;
  }

  async updatePassword(id, senha) {
    return this.update(id, { senha, senhaAlteradaEm: new Date() });
  }

  async deleteAccount(id) {
    if (this.temAdocao) return false;
    this.excluidos.push(id);
    return true;
  }
}

// "Hash" simples para os testes 
const fakeHasher = {
  hash: async (senha) => `hash:${senha}`,
  compare: async (senha, hash) => hash === `hash:${senha}`,
};

const fakeCepService = {
  buscar: async (cep) => ({ cep, logradouro: 'Rua A', bairro: 'Centro', cidade: 'Lavras', uf: 'MG' }),
};

const fakeTokenService = {
  generate: (payload) => `token:${payload.sub}`,
};

module.exports = { FakeUserRepository, fakeHasher, fakeCepService, fakeTokenService };