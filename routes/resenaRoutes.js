const express = require('express');
const resenaController = require('../controllers/resenaController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, resenaController.createResena);

// Bug #3: compatibilidad dual — frontend usa ?id_equipo=1 y también /equipo/:equipoId
router.get('/', resenaController.getResenasByEquipo);
router.get('/equipo/:equipoId', resenaController.getResenasByEquipo);

module.exports = router;
