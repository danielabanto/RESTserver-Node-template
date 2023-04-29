const { request, response } = require("express");

const esAdminRole = async (req = request, res = response, next) => {
  if (!req.usuarioAutenticado) {
    return res.status(500).json({
      msg: "Se quiere verificar el rol sin validar el token primero",
    });
  }

  const { rol, nombre } = req.usuarioAutenticado;
  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${nombre} no es admin`,
    });
  }

  next();
};

const tieneRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.usuarioAutenticado) {
      return res.status(500).json({
        msg: "Se quiere verificar el rol sin validar el token primero",
      });
    }
    if (!roles.includes(req.usuarioAutenticado.rol)) {
      return res.status(401).json({
        msg: "Rol sin privilegios",
      });
    }
    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRole,
};
