const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res, next) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    ok: true,
    message: 'Usuario registrado exitosamente',
    data: {
      user
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({
      ok: false,
      error: 'Por favor ingrese email y contraseña'
    });
  }

  const { user, token } = await authService.loginUser(email, contrasena);

  res.status(200).json({
    ok: true,
    token,
    user
  });
});

exports.getMe = (req, res, next) => {
  res.status(200).json({
    ok: true,
    user: req.user
  });
};
