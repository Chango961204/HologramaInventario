const { prisma } = require("../config/db");

async function createProduct(req, res) {
  try {
    const { name, description, price, stock } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nombre requerido" });
    }

    // 1) Crear producto
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: Number(price || 0),
        createdById: req.user.id,
      },
    });

    // 2) Si mandan stock inicial, se crea movimiento IN
    if (stock && Number(stock) > 0) {
      await prisma.productMovement.create({
        data: {
          type: "IN",
          quantity: Number(stock),
          note: "Stock inicial al crear producto",
          productId: product.id,
          userId: req.user.id,
        },
      });
    }

    // 3) Regresar producto con movimientos incluidos
    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        movements: true,
      },
    });

    return res.status(201).json(fullProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creando producto" });
  }
}

//  Listar productos (TODOS ven el mismo inventario)
async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        movements: true,
      },
    });

    // calcular totales por producto
    const formatted = products.map((p) => {
      const totalIN = p.movements
        .filter((m) => m.type === "IN")
        .reduce((acc, m) => acc + m.quantity, 0);

      const totalOUT = p.movements
        .filter((m) => m.type === "OUT")
        .reduce((acc, m) => acc + m.quantity, 0);

      const stockActual = totalIN - totalOUT;

      const totalToPay = totalOUT * Number(p.price || 0);

      return {
        ...p,
        totalIN,
        totalOUT,
        stockActual,
        totalToPay,
      };
    });

    return res.json(formatted);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error listando productos" });
  }
}


//  Obtener 1 producto (con movimientos y resumen)
async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        movements: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const totalIN = product.movements
      .filter((m) => m.type === "IN")
      .reduce((acc, m) => acc + m.quantity, 0);

    const totalOUT = product.movements
      .filter((m) => m.type === "OUT")
      .reduce((acc, m) => acc + m.quantity, 0);

    const stockActual = totalIN - totalOUT;
    const totalToPay = totalOUT * product.price;

    return res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      createdBy: product.createdBy,

      totalIN,
      totalOUT,
      stockActual,
      totalToPay,

      movements: product.movements,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error obteniendo producto" });
  }
}

//  Actualizar producto
// Solo ADMIN debería poder (eso lo controlas en middleware)
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const exists = await prisma.product.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? exists.name,
        description: description ?? exists.description,
        price: price !== undefined ? Number(price) : exists.price,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error actualizando producto" });
  }
}

// Eliminar producto
// Solo ADMIN debería poder
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const exists = await prisma.product.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error eliminando producto" });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
