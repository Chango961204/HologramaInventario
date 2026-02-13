const { prisma } = require("../config/db");

// Crear movimiento IN / OUT
async function createMovement(req, res) {
  try {
    const { productId } = req.params;
    const { type, quantity, note } = req.body;

    if (!type || !["IN", "OUT"].includes(type)) {
      return res.status(400).json({ message: "Tipo inválido (IN / OUT)" });
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      return res.status(400).json({ message: "Cantidad inválida" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Crear movimiento
    const movement = await prisma.productMovement.create({
      data: {
        type,
        quantity: qty,
        note: note || null,
        productId,
        userId: req.user.id,
      },
    });

    return res.status(201).json(movement);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creando movimiento" });
  }
}

// Listar movimientos por producto
async function getMovementsByProduct(req, res) {
  try {
    const { productId } = req.params;

    const movements = await prisma.productMovement.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.json(movements);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error listando movimientos" });
  }
}

module.exports = {
  createMovement,
  getMovementsByProduct,
};
