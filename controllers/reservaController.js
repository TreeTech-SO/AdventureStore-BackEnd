const reservaService = require('../services/reservaService');
const catchAsync = require('../utils/catchAsync');

exports.createReserva = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const reserva = await reservaService.createReserva(userId, req.body);

  res.status(201).json({
    ok: true,
    message: 'Reserva creada exitosamente',
    data: { reserva }
  });
});

exports.getReservasUsuario = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const reservas = await reservaService.getReservasUsuario(userId);

  res.status(200).json({
    ok: true,
    data: { reservas }
  });
});

exports.getReservaById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const reserva = await reservaService.getReservaById(id, userId);

  if (!reserva) {
    return res.status(404).json({
      ok: false,
      error: 'Reserva no encontrada o no pertenece a este usuario'
    });
  }

  res.status(200).json({
    ok: true,
    data: { reserva }
  });
});

exports.pagarReserva = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const reserva = await reservaService.updateEstadoReserva(id, userId, 'confirmada');

  if (!reserva) {
    return res.status(404).json({
      ok: false,
      error: 'Reserva no encontrada o no pertenece a este usuario'
    });
  }

  res.status(200).json({
    ok: true,
    message: 'Reserva confirmada exitosamente',
    data: { reserva }
  });
});

exports.cancelarReserva = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const reserva = await reservaService.updateEstadoReserva(id, userId, 'cancelada');

  if (!reserva) {
    return res.status(404).json({
      ok: false,
      error: 'Reserva no encontrada o no pertenece a este usuario'
    });
  }

  res.status(200).json({
    ok: true,
    message: 'Reserva cancelada exitosamente',
    data: { reserva }
  });
});
