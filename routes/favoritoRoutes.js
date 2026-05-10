const express = require('express');
const favoritoController = require('../controllers/favoritoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Todas las rutas de favoritos requieren autenticación

router.route('/')
  .get(favoritoController.getFavoritos)
  .post(favoritoController.addFavorito);

router.route('/:id_equipo')
  .delete(favoritoController.removeFavorito);

module.exports = router;
