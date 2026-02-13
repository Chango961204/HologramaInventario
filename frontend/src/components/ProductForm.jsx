import { useState } from "react";
import api from "../api/axios";

// shadcn
import { Button } from "@/components/ui/button";

// icons
import { Save } from "lucide-react";

export default function ProductForm({ onCreated }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function validate() {
        if (!name.trim()) return "El nombre es obligatorio";
        if (name.trim().length < 2) return "Nombre demasiado corto";

        const p = Number(price);
        const s = Number(stock);

        if (price === "" || isNaN(p)) return "El precio es obligatorio";
        if (p < 0) return "El precio no puede ser negativo";

        if (stock === "" || isNaN(s)) return "El stock es obligatorio";
        if (s < 0) return "El stock no puede ser negativo";

        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }

        try {
            setLoading(true);

            await api.post("/products", {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                stock: Number(stock),
            });

            setName("");
            setDescription("");
            setPrice("");
            setStock("");

            onCreated();
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Error al crear producto");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl hover:bg-white/15 transition">
            <h3 className="text-xl font-black text-white">Nuevo producto</h3>
            <p className="text-sm text-white/60 mt-1">
                Agrega un producto al inventario del rave
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <input
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Nombre del producto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Descripción (opcional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/30"
                        placeholder="Precio"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <input
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/30"
                        placeholder="Stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="rounded-xl bg-red-500/20 border border-red-500/30 p-3 text-sm text-white">
                        {error}
                    </div>
                )}

                <Button
                    disabled={loading}
                    type="submit"
                    className="w-full rounded-xl font-black"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </form>
        </div>
    );
}
