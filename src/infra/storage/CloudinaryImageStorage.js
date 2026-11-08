const cloudinary = require('cloudinary').v2;

const PASTA = 'adocao-animais';

class CloudinaryImageStorage {
  constructor({ cloudName, apiKey, apiSecret }) {
    this.configurado = Boolean(cloudName && apiKey && apiSecret);

    if (this.configurado) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
    }
  }

  upload(buffer) {
    return new Promise((resolve, reject) => {
      const envio = cloudinary.uploader.upload_stream(
        { folder: PASTA, resource_type: 'image' },
        (erro, resultado) => {
          if (erro) return reject(erro);
          return resolve({ url: resultado.secure_url, publicId: resultado.public_id });
        },
      );
      envio.end(buffer);
    });
  }

  async remove(publicId) {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  }
}

module.exports = CloudinaryImageStorage;