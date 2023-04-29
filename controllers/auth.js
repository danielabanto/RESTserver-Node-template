const { response } = require("express");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require("../models/usuario");

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    //Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    //Vefificar contrasena
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: "ok",
      usuario,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Hable con el admin",
    });
  }
};

module.exports = {
  login,
};