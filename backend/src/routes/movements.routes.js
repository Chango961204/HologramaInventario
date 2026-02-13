const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    createMovement,
    getMovementsByProduct,
} = require("../controllers/movements.controller");

/* // DEBUG (para que no adivines)
console.log("createMovement:", typeof createMovement);
console.log("getMovementsByProduct:", typeof getMovementsByProduct);
 */
// Crear movimiento (entrada o salida)
router.post("/:productId", authMiddleware, createMovement);

// Listar movimientos por producto
router.get("/:productId", authMiddleware, getMovementsByProduct);

module.exports = router;
