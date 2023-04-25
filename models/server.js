const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";

    //Middleware
    this.middlewares();

    //Rutas de la App
    this.routes();
  }

  middlewares() {
    this.app.use(cors()); //CORS
    this.app.use(express.json()); //Lectura y parseo del body
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running in port:", this.port);
    });
  }
}

module.exports = Server;
