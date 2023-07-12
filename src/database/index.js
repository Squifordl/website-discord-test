const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  start() {
    mongoose.connect(
      process.env.MONGODB_URI,
    );
    mongoose.connection.on("connected", () => {
      console.log(`[DataBase] - Conectado ao Banco de Dados.`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log(`[DataBase] - Desconectado do Banco de Dados.`);
    });

    mongoose.connection.on("error", (err) => {
      console.log(`[DataBase] - Erro: ${err}`);
    });
  },
};
