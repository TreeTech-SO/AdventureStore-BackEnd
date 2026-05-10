const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(categoriaController.getAllCategorias)
  .post(protect, authorize('admin'), categoriaController.createCategoria);

router.route('/:id')
  .put(protect, authorize('admin'), categoriaController.updateCategoria)
  .delete(protect, authorize('admin'), categoriaController.deleteCategoria);

module.exports = router;
