import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import bgDashboard from "../assets/EvenMore2Dashboard.JPEG";
import PosProductForm from "../components/PosProductForm";
import PosProductCard from "../components/PosProductCard";
import PosProductStats from "../components/PosProductStats";

export default function PosPage() {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    async function loadProducts() {
        try {
            const res = await api.get("/pos-products");
            setProducts(res.data);
        } catch (err) {
            console.error("Error cargando productos", err);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div
            className="min-h-screen bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bgDashboard})` }}
        >
            <div className="absolute inset-0 bg-black/70"></div>

            <div className="relative z-10">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div>
                        <h2 className="text-3xl font-black text-white">
                            Punto de Venta
                        </h2>
                        <p className="text-white/70 text-sm">
                            Venta 
                        </p>
                    </div>

                    <PosProductStats products={products} />

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 👇 SOLO ADMIN PUEDE CREAR */}
                        {user?.role === "ADMIN" && (
                            <div>
                                <PosProductForm onCreated={loadProducts} />
                            </div>
                        )}

                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {products.map((product) => (
                                <PosProductCard
                                    key={product.id}
                                    product={product}
                                    onUpdated={loadProducts}
                                    isAdmin={user?.role === "ADMIN"}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}