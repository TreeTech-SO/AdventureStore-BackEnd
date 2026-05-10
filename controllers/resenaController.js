const resenaService = require('../services/resenaService');
const catchAsync = require('../utils/catchAsync');

exports.createResena = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const resena = await resenaService.createResena(userId, req.body);

  res.status(201).json({
    ok: true,
    message: 'Reseña creada exitosamente',
    data: { resena }
  });
});

// Bug #3: compatible con /equipo/:equipoId Y con /?id_equipo=1
exports.getResenasByEquipo = catchAsync(async (req, res, next) => {
  const equipoId = req.params.equipoId || req.query.id_equipo;

  if (!equipoId) {
    return res.status(400).json({
      ok: false,
      error: 'Debe proporcionar el id_equipo'
    });
  }

  const resenas = await resenaService.getResenasByEquipo(equipoId);

  res.status(200).json({
    ok: true,
    data: { resenas }
  });
});
