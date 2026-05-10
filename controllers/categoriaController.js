const categoriaService = require('../services/categoriaService');
const catchAsync = require('../utils/catchAsync');

exports.getAllCategorias = catchAsync(async (req, res, next) => {
  const categorias = await categoriaService.getAllCategorias();
  
  res.status(200).json({
    ok: true,
    data: { categorias }
  });
});

exports.createCategoria = catchAsync(async (req, res, next) => {
  const categoria = await categoriaService.createCategoria(req.body);

  res.status(201).json({
    ok: true,
    message: 'Categoría creada exitosamente',
    data: { categoria }
  });
});

exports.updateCategoria = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updated = await categoriaService.updateCategoria(id, req.body);

  if (!updated) {
    return res.status(404).json({
      ok: false,
      error: 'Categoría no encontrada'
    });
  }

  res.status(200).json({
    ok: true,
    message: 'Categoría actualizada correctamente'
  });
});

exports.deleteCategoria = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await categoriaService.deleteCategoria(id);

  if (!deleted) {
    return res.status(404).json({
      ok: false,
      error: 'Categoría no encontrada'
    });
  }

  res.status(200).json({
    ok: true,
    message: 'Categoría eliminada correctamente'
  });
});
