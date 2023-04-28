const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query; // const query = req.query;
  const query = { estado: true }; // Solo los usuarios con estado activo (no eliminado virtual)

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(from)).limit(Number(limit)), // Paginacion
  ]);

  res.json({ total, usuarios });
};

const usuariosPut = async (req, res) => {
  const { id } = req.params;

  //extraemos el _id para no intentar actualizar
  const { _id, password, google, correo, ...rest } = req.body;
  if (password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, rest);

  res.json(usuario);
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en DB
  await usuario.save();

  res.json({ msg: "post API - controller", usuario });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  // Borrado Fisico
  // const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json(usuario);
};

const usuariosPatch = (req, res = response) => {
  res.json({ msg: "patch API - controller" });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
