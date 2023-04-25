const { response, request } = require("express");

const usuariosGet = (req = request, res = response) => {
  const query = req.query;
  res.json({ msg: "get API - controller", query });
};
const usuariosPut = (req, res) => {
  const { id } = req.params;
  res.json({ msg: "put API - controller", id });
};
const usuariosPost = (req, res = response) => {
  const body = req.body;
  res.json({ msg: "post API - controller", body });
};
const usuariosDelete = (req, res = response) => {
  res.json({ msg: "delete API - controller" });
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
