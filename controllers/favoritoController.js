const favoritoService = require('../services/favoritoService');
const catchAsync = require('../utils/catchAsync');

exports.addFavorito = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const id_equipo = parseInt(req.body.id_equipo, 10);

  if (!id_equipo || isNaN(id_equipo)) {
    return res.status(400).json({
      ok: false,
      error: 'Debe proporcionar un id_equipo válido'
    });
  }

  const favorito = await favoritoService.addFavorito(userId, id_equipo);

  res.status(201).json({
    ok: true,
    message: 'Equipo agregado a favoritos',
    data: { favorito }
  });
});

// Bug #4: el parámetro es :id_equipo, no :id (favorito)
exports.removeFavorito = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { id_equipo } = req.params;

  const removed = await favoritoService.removeFavorito(id_equipo, userId);

  if (!removed) {
    return res.status(404).json({
      ok: false,
      error: 'Favorito no encontrado o no pertenece al usuario'
    });
  }

  res.status(200).json({
    ok: true,
    message: 'Equipo eliminado de favoritos'
  });
});

exports.getFavoritos = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const favoritos = await favoritoService.getFavoritosByUsuario(userId);

  res.status(200).json({
    ok: true,
    data: { favoritos }
  });
});
