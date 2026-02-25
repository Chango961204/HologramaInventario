import { useState } from "react";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function PosProductForm({ onCreated }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!name.trim()) return setError("Nombre obligatorio");
        if (!price || Number(price) <= 0)
            return setError("Precio inválido");

        try {
            setLoading(true);

            await api.post("/pos-products", {
                name: name.trim(),
                price: Number(price),
            });

            setName("");
            setPrice("");
            onCreated();
        } catch (err) {
            setError(err.response?.data?.message || "Error creando producto");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 text-white shadow-xl">
            <h3 className="text-xl font-black">Nuevo producto POS</h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input
                    className="w-full rounded-2xl bg-white/10 border border-white/10 p-3 text-white outline-none"
                    placeholder="Nombre (Ej: Cerveza)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full rounded-2xl bg-white/10 border border-white/10 p-3 text-white outline-none"
                    placeholder="Precio"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                {error && (
                    <div className="text-red-400 text-sm">{error}</div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl font-black"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </form>
        </div>
    );
}