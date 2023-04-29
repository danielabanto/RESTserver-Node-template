const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
    const usuario = await Usuario.findById(payload.uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido - usuario no existe en DB",
      });
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no valido - usuario con estado false",
      });
    }

    req.usuarioAutenticado = usuario;
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
  next();
};

module.exports = {
  validarJWT,
};
