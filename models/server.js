const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.usuariosPath = "/api/usuarios";
    this.authPath = "/api/auth";
    this.productosPath = "/api/productos";
    this.categoriasPath = "/api/categorias";
    this.buscarPath = "/api/buscar";

    //Db connect
    this.conectarDB();

    //Middleware
    this.middlewares();

    //Rutas de la App
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors()); //CORS
    this.app.use(express.json()); //Lectura y parseo del body
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
    this.app.use(this.categoriasPath, require("../routes/categorias"));
    this.app.use(this.productosPath, require("../routes/productos"));
    this.app.use(this.buscarPath, require("../routes/buscar"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running in port:", this.port);
    });
  }
}

module.exports = Server;
