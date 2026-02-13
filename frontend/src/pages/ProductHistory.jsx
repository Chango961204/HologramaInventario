import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ProductHistory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setLoading(true);

            const [productRes, movementsRes] = await Promise.all([
                api.get(`/products/${id}`),
                api.get(`/movements/${id}`),
            ]);

            setProduct(productRes.data);
            setMovements(movementsRes.data);
        } catch (error) {
            console.log(error);
            alert("Error cargando historial");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [id]);

    const totalIN = movements
        .filter((m) => m.type === "IN")
        .reduce((acc, m) => acc + m.quantity, 0);

    const totalOUT = movements
        .filter((m) => m.type === "OUT")
        .reduce((acc, m) => acc + m.quantity, 0);

    const stockActual = totalIN - totalOUT;

    const totalToPay = totalOUT * Number(product?.price || 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Cargando historial...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 py-6">
            {/* header */}
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-sm text-white/70 hover:text-white transition"
                >
                    ← Volver
                </button>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black">
                            Historial: {product?.name}
                        </h1>
                        <p className="text-white/60 text-sm mt-1">
                            Movimientos registrados del inventario (IN / OUT)
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                        <p className="text-xs text-white/50">Precio</p>
                        <p className="text-lg font-black">${product?.price}</p>
                    </div>
                </div>

                {/* resumen */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <p className="text-xs text-white/50">Total IN</p>
                        <p className="text-xl font-black">{totalIN}</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <p className="text-xs text-white/50">Total OUT</p>
                        <p className="text-xl font-black">{totalOUT}</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <p className="text-xs text-white/50">Stock actual</p>
                        <p className="text-xl font-black">{stockActual}</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <p className="text-xs text-white/50">Total a pagar</p>
                        <p className="text-xl font-black">${totalToPay}</p>
                    </div>
                </div>

                {/* tabla */}
                <div className="mt-6 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white/5">
                                <tr className="text-left text-white/60">
                                    <th className="p-4">Fecha</th>
                                    <th className="p-4">Tipo</th>
                                    <th className="p-4">Cantidad</th>
                                    <th className="p-4">Registró</th>
                                    <th className="p-4">Nota</th>
                                </tr>
                            </thead>

                            <tbody>
                                {movements.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-6 text-center text-white/50">
                                            No hay movimientos aún.
                                        </td>
                                    </tr>
                                ) : (
                                    movements.map((m) => (
                                        <tr
                                            key={m.id}
                                            className="border-t border-white/10 hover:bg-white/5 transition"
                                        >
                                            <td className="p-4 text-white/80 whitespace-nowrap">
                                                {new Date(m.createdAt).toLocaleString()}
                                            </td>

                                            <td className="p-4 font-bold whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-black ${m.type === "IN"
                                                            ? "bg-lime-400 text-black"
                                                            : "bg-cyan-400 text-black"
                                                        }`}
                                                >
                                                    {m.type}
                                                </span>
                                            </td>

                                            <td className="p-4 font-black text-white whitespace-nowrap">
                                                {m.quantity}
                                            </td>

                                            <td className="p-4 text-white/80 whitespace-nowrap">
                                                {m.user?.name || "—"}
                                            </td>

                                            <td className="p-4 text-white/70">
                                                {m.note || "—"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* footer */}
                <p className="text-xs text-white/40 mt-6">
                    Sesión: {user?.name} ({user?.role})
                </p>
            </div>
        </div>
    );
}
