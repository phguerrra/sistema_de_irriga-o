const router = require("express").Router();
const ctrl = require("../controllers/mangueiraController");
const auth = require("../middlewares/authMiddleware");

// LISTAR E CRIAR
router.get("/api/mangueiras", auth, ctrl.listar);
router.post("/api/mangueiras", auth, ctrl.criar);

// LIGAR / DESLIGAR
router.post("/on/:mangueira", auth, ctrl.ligar);
router.post("/off/:mangueira", auth, ctrl.desligar);

// HISTÓRICO
router.get(
  "/api/mangueiras/:id/historico",
  auth,
  ctrl.historico
);

module.exports = router;
