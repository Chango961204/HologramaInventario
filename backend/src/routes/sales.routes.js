const router = require("express").Router();
const controller = require("../controllers/sales.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, controller.createSale);

// Resumen por producto
router.get("/summary", auth, controller.getSalesSummary);

// Total vendido hoy
router.get("/today", auth, controller.getTodaySummary);

module.exports = router;