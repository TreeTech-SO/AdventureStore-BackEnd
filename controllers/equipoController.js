const equipoService = require('../services/equipoService');
const catchAsync = require('../utils/catchAsync');

exports.getAllEquipos = catchAsync(async (req, res, next) => {
  const equipos = await equipoService.getAllEquipos(req.query);
  
  res.status(200).json({
    ok: true,
    data: { equipos }
  });
});

exports.getEquipoById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const equipo = await equipoService.getEquipoById(id);

  if (!equipo) {
    return res.status(404).json({
      ok: false,
      error: 'Equipo no encontrado'
    });
  }

  res.status(200).json({
    ok: true,
    data: { equipo }
  });
});

exports.createEquipo = catchAsync(async (req, res, next) => {
  const equipo = await equipoService.createEquipo(req.body);

  res.status(201).json({
    ok: true,
    message: 'Equipo creado exitosamente',
    data: { equipo }
  });
});

exports.updateEquipo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updated = await equipoService.updateEquipo(id, req.body);

  if (!updated) {
    return res.status(404).json({
      ok: false,
      error: 'Equipo no encontrado'
    });
  }

  res.status(200).json({
    ok: true,
    message: 'Equipo actualizado correctamente'
  });
});

exports.deleteEquipo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await equipoService.deleteEquipo(id);

  if (!deleted) {
    return res.status(404).json({
      ok: false,
      error: 'Equipo no encontrado'
    });
  }

  res.status(200).json({
    ok: true,
    message: 'Equipo eliminado correctamente'
  });
});
