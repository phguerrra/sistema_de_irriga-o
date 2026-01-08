console.log("🔥 app.js carregado com sucesso");

require("dotenv").config();
require("./mqtt/listener");


const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ================================
// MIDDLEWARES GLOBAIS
// ================================
app.use(cors());
app.use(express.json());



// ================================
// FRONTEND (HTML + JS)
// ================================
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", require("./routes/auth.routes"));
app.use(require("./routes/mangueira.routes"));
app.use(require("./routes/status.routes"));
// ================================
// ROTAS (VÃO ENTRAR AQUI)
// ================================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
