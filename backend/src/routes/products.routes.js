const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");

/* // DEBUG
console.log("authMiddleware:", typeof authMiddleware);
console.log("adminMiddleware:", typeof adminMiddleware);
console.log("getProducts:", typeof getProducts);
 */
// ROUTES
router.get("/", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getProductById);

router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
