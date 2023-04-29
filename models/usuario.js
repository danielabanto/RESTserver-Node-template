const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "Name is required"],
  },
  correo: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
    emun: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

// Modificamos para obtener los campos excepto __v y password
UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...rest } = this.toObject();
  rest.uid = _id;

  return rest;
};

module.exports = model("Usuario", UsuarioSchema);
