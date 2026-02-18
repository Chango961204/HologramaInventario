import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

export default function MovementModal({ open, onClose, onConfirm, type }) {
    const [quantity, setQuantity] = useState("");
    const [note, setNote] = useState("");

    const isIN = type === "IN";

    useEffect(() => {
        if (!open) {
            setQuantity("");
            setNote("");
        }
    }, [open]);

    async function handleSubmit(e) {
        e.preventDefault();

        await onConfirm({
            quantity: Number(quantity),
            note,
        });

        onClose();
    }

    return (
        <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
            <Dialog.Portal>
                {/* Overlay */}
                <Dialog.Overlay
                    className="
            fixed inset-0 z-50
            bg-black/80
            sm:bg-black/70
            sm:backdrop-blur-sm
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
          "
                />

                {/* Content */}
                <Dialog.Content
                    className="
            fixed z-50
            left-1/2 top-1/2
            w-[95vw] sm:w-full sm:max-w-md
            -translate-x-1/2 -translate-y-1/2
            rounded-3xl
            bg-zinc-950 border border-white/10
            shadow-2xl
            p-6
            max-h-[85vh] overflow-y-auto
            focus:outline-none

            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
          "
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Dialog.Title className="text-xl font-bold text-white">
                                {isIN ? "➕ Entrada de producto" : "➖ Venta / salida"}
                            </Dialog.Title>

                            <Dialog.Description className="text-sm text-white/60 mt-1">
                                {isIN
                                    ? "Registra producto que te llegó"
                                    : "Registra producto que metiste / vendiste"}
                            </Dialog.Description>
                        </div>

                        {/* Close */}
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="rounded-2xl px-3 py-2 bg-white/10 text-white hover:bg-white/15 transition"
                            >
                                ✕
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Cantidad"
                            className="w-full rounded-2xl bg-white/10 border border-white/10 p-3 text-white outline-none focus:ring-2 focus:ring-lime-400/30"
                            required
                            min={1}
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

                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="flex-1 rounded-2xl py-3 font-semibold bg-white/10 text-white hover:bg-white/15 transition"
                                >
                                    Cancelar
                                </button>
                            </Dialog.Close>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
