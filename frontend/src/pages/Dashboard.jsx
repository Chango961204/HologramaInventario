import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";
import InventoryStats from "../components/InventoryStats";
import bgDashboard from "../assets/EvenMore2Dashboard.JPEG";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    async function loadProducts() {
        try {
            setError("");
            setLoadingProducts(true);
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.log(err);
            setError("No se pudo cargar el inventario 😢");
        } finally {
            setLoadingProducts(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    return (
        <div
            className="min-h-screen bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bgDashboard})` }}
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/70"></div>

            {/* contenido */}
            <div className="relative z-10">
                <Navbar />

                <div className="max-w-6xl mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                Inventario del evento
                            </h2>
                            <p className="text-white/70 text-sm mt-1">
                                Control rápido y sencillo (modo rave edition ⚡)
                            </p>
                        </div>

                        {/* Search */}
                        <div className="w-full md:w-96">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar producto..."
                                className="w-full rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/30"
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-6">
                        <InventoryStats products={products} />
                    </div>

                    {/* Layout principal */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form */}
                        <div className="lg:col-span-1">
                            <ProductForm onCreated={loadProducts} />
                        </div>

                        {/* Lista */}
                        <div className="lg:col-span-2">
                            {loadingProducts ? (
                                <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 text-white">
                                    Cargando inventario...
                                </div>
                            ) : error ? (
                                <div className="rounded-2xl bg-red-500/20 backdrop-blur-xl border border-red-500/30 p-6 text-white">
                                    {error}
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 text-white/70">
                                    No hay productos todavía.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredProducts.map((p) => (
                                        <ProductCard key={p.id} product={p} onUpdated={loadProducts} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    );
}
