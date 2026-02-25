const router = require("express").Router();
const controller = require("../controllers/posProducts.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");


// ===============================
// SOLO ADMIN
// ===============================

// Crear producto
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  controller.createProduct
);

// Editar producto
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  controller.updateProduct
);

// Eliminar producto
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  controller.deleteProduct
);


// ===============================
// ADMIN Y USER
// ===============================



// Ver productos
router.get(
  "/",
  authMiddleware,
  controller.getProducts
);

module.exports = router;