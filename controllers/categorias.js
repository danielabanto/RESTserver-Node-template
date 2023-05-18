const { response, request } = require("express");
const Categoria = require("../models/categoria");

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(Number(from))
      .limit(Number(limit)), // Paginacion
  ]);

  res.json({
    total,
    categorias,
  });
};

const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  res.json(categoria);
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  try {
    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
      return res.status(400).json({
        msg: `La categoria ${categoriaDB.nombre} ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      nombre,
      usuario: req.usuarioAutenticado._id,
    };

    const categoria = new Categoria(data);
    //Guardar Db
    await categoria.save();
    res.status(201).json(categoria);
  } catch (err) {
    console.log(err);
  }
};

// actualizar categoria por nombre
const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuarioAutenticado._id;
  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true }); //{ new: true } devuelve la data actualizada
  res.json(categoria);
};

// borrarCategoria - estado false
const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoriaBorrada = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(categoriaBorrada);
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
