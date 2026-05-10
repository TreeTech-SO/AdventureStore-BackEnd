const express = require('express');
const reservaController = require('../controllers/reservaController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Todas las rutas de reservas requieren autenticación

router.route('/')
  .post(reservaController.createReserva)
  .get(reservaController.getReservasUsuario);

router.route('/:id')
  .get(reservaController.getReservaById);

router.route('/:id/pagar')
  .put(reservaController.pagarReserva);

router.route('/:id/cancelar')
  .put(reservaController.cancelarReserva);

module.exports = router;
