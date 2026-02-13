import { useState } from "react";

export default function MovementModal({ open, onClose, onConfirm, type }) {
    const [quantity, setQuantity] = useState("");
    const [note, setNote] = useState("");

    if (!open) return null;

    const isIN = type === "IN";

    async function handleSubmit(e) {
        e.preventDefault();
        await onConfirm({
            quantity: Number(quantity),
            note,
        });
        setQuantity("");
        setNote("");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* overlay */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            ></div>

            {/* modal */}
            <form
                onSubmit={handleSubmit}
                className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-zinc-950 border border-white/10 p-6 shadow-2xl"
            >
                <h3 className="text-xl font-bold text-white">
                    {isIN ? "➕ Entrada de producto" : "➖ Venta / salida"}
                </h3>

                <p className="text-sm text-white/60 mt-1">
                    {isIN
                        ? "Registra producto que te llegó"
                        : "Registra producto que metiste / vendiste"}
                </p>

                <div className="mt-5 space-y-3">
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Cantidad"
                        className="w-full rounded-2xl bg-white/10 border border-white/10 p-3 text-white outline-none focus:ring-2 focus:ring-lime-400/30"
                    />

                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Nota (opcional) Ej: Llegaron 20 a las 10pm"
                        className="w-full rounded-2xl bg-white/10 border border-white/10 p-3 text-white outline-none focus:ring-2 focus:ring-lime-400/30"
                    />

                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            className={`flex-1 rounded-2xl py-3 font-semibold transition ${isIN
                                    ? "bg-lime-400 text-black hover:bg-lime-300"
                                    : "bg-cyan-400 text-black hover:bg-cyan-300"
                                }`}
                        >
                            Confirmar
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-2xl py-3 font-semibold bg-white/10 text-white hover:bg-white/15 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
