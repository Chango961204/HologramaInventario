const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// ===============================
// CREAR PRODUCTO
// ===============================
async function createProduct(req, res) {
    try {
        const { name, price } = req.body;

        const product = await prisma.posProduct.create({
            data: {
                name,
                price
            }
        });

        res.json(product);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando producto POS" });
    }
}


// ===============================
// OBTENER PRODUCTOS
// ===============================
async function getProducts(req, res) {
    try {

        const products = await prisma.posProduct.findMany({
            where: { active: true },
            include: {
                saleItems: true
            }
        });

        const productsWithTotals = products.map(product => {

            const totalSold = product.saleItems.reduce((acc, item) => {
                return acc + item.quantity;
            }, 0);

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                active: product.active,
                totalSold
            };
        });

        res.json(productsWithTotals);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo productos" });
    }
}


// ===============================
// ACTUALIZAR PRODUCTO
// ===============================
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        const updated = await prisma.posProduct.update({
            where: { id: id },
            data: {
                name,
                price
            }
        });

        res.json(updated);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error actualizando producto" });
    }
}


// ===============================
// ELIMINAR PRODUCTO
// ===============================
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        await prisma.posProduct.update({
            where: { id },
            data: { active: false }
        });

        res.json({ message: "Producto desactivado" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error eliminando producto" });
    }
}


// ===============================
// EXPORTS CORRECTOS
// ===============================
module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
};