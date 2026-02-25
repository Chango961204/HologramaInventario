const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSale = async (req, res) => {
    try {
        const { items } = req.body;
        const userId = req.user?.id;

        // Obtener productos reales desde DB
        const productIds = items.map(i => i.posProductId);

        const products = await prisma.posProduct.findMany({
            where: {
                id: { in: productIds }
            }
        });

        let total = 0;

        const saleItemsData = items.map(item => {
            const product = products.find(p => p.id === item.posProductId);

            const subtotal = product.price * item.quantity;
            total += subtotal;

            return {
                posProductId: product.id,
                quantity: item.quantity,
                price: product.price,
                subtotal
            };
        });

        const sale = await prisma.sale.create({
            data: {
                total,
                userId,
                items: {
                    create: saleItemsData
                }
            },
            include: {
                items: true
            }
        });

        res.json(sale);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando venta" });
    }
};

/**
 * Resumen por producto (para estadísticas)
 */
exports.getSalesSummary = async (req, res) => {
    try {
        const summary = await prisma.saleItem.groupBy({
            by: ["posProductId"],
            _sum: {
                quantity: true,
                subtotal: true,
            },
        });

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo resumen" });
    }
};

/**
 * Total vendido hoy
 */
exports.getTodaySummary = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const sales = await prisma.sale.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                },
            },
        });

        const todayTotal = sales.reduce(
            (sum, sale) => sum + sale.total,
            0
        );

        res.json({ todayTotal });
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo resumen del día" });
    }
};