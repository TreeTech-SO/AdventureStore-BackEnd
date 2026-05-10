const express = require('express');
const equipoController = require('../controllers/equipoController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(equipoController.getAllEquipos)
  .post(protect, authorize('admin'), equipoController.createEquipo);

router.route('/:id')
  .get(equipoController.getEquipoById)
  .put(protect, authorize('admin'), equipoController.updateEquipo)
  .delete(protect, authorize('admin'), equipoController.deleteEquipo);

module.exports = router;
