const router = require("express").Router();
const ctrl = require("../controllers/statusController");
const auth = require("../middlewares/authMiddleware");

router.get("/api/status/:id", auth, ctrl.status);

module.exports = router;
