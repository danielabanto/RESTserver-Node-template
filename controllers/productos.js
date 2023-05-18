const { request, response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(from))
      .limit(Number(limit)), // Paginacion
  ]);

  res.json({
    total,
    productos,
  });
};

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");
  res.json(producto);
};

const crearProducto = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body;
  body.nombre = body.nombre.toUpperCase();
  try {
    const productoDB = await Producto.findOne({ nombre: body.nombre });
    if (productoDB) {
      return res.status(400).json({
        msg: `El producto ${productoDB.nombre} ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...body,
      nombre: body.nombre,
      usuario: req.usuarioAutenticado._id,
    };

    const producto = new Producto(data);
    //Guardar Db
    await producto.save();
    res.status(201).json(producto);
  } catch (err) {
    console.log(err);
  }
};

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  const otroProducto = await Producto.findOne({ nombre: data.nombre });
  if (otroProducto) {
    return res.status(400).json({
      msg: `El nombre ${data.nombre} ya esta siendo utilizado`,
    });
  }
  data.usuario = req.usuarioAutenticado._id;
  console.log("data", data);
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true }); //{ new: true } devuelve la data actualizada
  res.json(producto);
};

const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(productoBorrado);
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};
