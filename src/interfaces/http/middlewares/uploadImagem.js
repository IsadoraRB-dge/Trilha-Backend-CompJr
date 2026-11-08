const multer = require('multer');
const AppError = require('../../../domain/errors/AppError');

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAXIMO_MB = 5;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TAMANHO_MAXIMO_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, arquivo, callback) => {
    if (!TIPOS_PERMITIDOS.includes(arquivo.mimetype)) {
      return callback(new AppError('A foto deve ser uma imagem JPG, PNG ou WEBP', 400));
    }
    return callback(null, true);
  },
}).single('foto');

function uploadImagem(req, res, next) {
  upload(req, res, (erro) => {
    if (erro instanceof multer.MulterError) {
      if (erro.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError(`A foto deve ter no máximo ${TAMANHO_MAXIMO_MB} MB`, 413));
      }
      return next(new AppError('Envie uma única imagem no campo "foto"', 400));
    }

    if (erro) return next(erro);

    if (!req.file) {
      return next(new AppError('Envie uma imagem no campo "foto" (multipart/form-data)', 400));
    }

    return next();
  });
}

module.exports = uploadImagem;