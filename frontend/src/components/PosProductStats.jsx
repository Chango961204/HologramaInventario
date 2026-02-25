export default function PosProductStats({ products }) {

    const totalSales = products.reduce((acc, p) => {
        return acc + (p.totalSold || 0) * (p.price || 0);
    }, 0);

    const totalUnits = products.reduce((acc, p) => {
        return acc + (p.totalSold || 0);
    }, 0);

    return (
        <div className="space-y-6 mb-6">

            {/* TOTAL GENERAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-xl">
                    <p className="text-white/60 text-sm">Total vendido (MXN)</p>
                    <p className="text-white text-3xl font-black mt-1">
                        ${totalSales.toLocaleString("es-MX")}
                    </p>
                </div>

                <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-xl">
                    <p className="text-white/60 text-sm">Unidades vendidas (Total)</p>
                    <p className="text-white text-3xl font-black mt-1">
                        {totalUnits}
                    </p>
                </div>

            </div>

            {/* DESGLOSE POR PRODUCTO */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-xl">

                <p className="text-white/60 text-sm mb-4">
                    Unidades vendidas por producto
                </p>

                <div className="space-y-2">
                    {products.map(product => (
                        <div
                            key={product.id}
                            className="flex justify-between border-b border-white/10 pb-2"
                        >
                            <span className="text-white">
                                {product.name}
                            </span>

                            <span className="text-white font-bold">
                                {product.totalSold || 0}
                            </span>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
}