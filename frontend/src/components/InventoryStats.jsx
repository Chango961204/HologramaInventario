export default function InventoryStats({ products }) {
    const totalProducts = products.length;

    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);

    const totalValue = products.reduce((acc, p) => {
        return acc + Number(p.totalToPay || 0);
    }, 0);


    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* productos */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-xl">
                <p className="text-white/60 text-sm">Productos</p>
                <p className="text-white text-3xl font-black mt-1">{totalProducts}</p>
            </div>

            {/* stock */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-xl">
                <p className="text-white/60 text-sm">Stock total</p>
                <p className="text-white text-3xl font-black mt-1">{totalStock}</p>
            </div>

            {/* valor */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-xl">
                <p className="text-white/60 text-sm">Valor inventario</p>
                <p className="text-white text-3xl font-black mt-1">
                    ${totalValue.toLocaleString("es-MX")}
                </p>
            </div>
        </div>
    );
}
