import api from "../api/axios";
import bgCard from "../assets/EvenMore3Cards.JPEG";
import { Button } from "@/components/ui/button";

export default function PosProductCard({ product, onUpdated, isAdmin }) {

  async function sell(quantity) {
    try {
      await api.post("/sales", {
        items: [
          {
            posProductId: product.id,
            quantity,
          },
        ],
      });

      await onUpdated();
    } catch (err) {
      alert("Error registrando venta");
    }
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar producto?")) return;

    try {
      await api.delete(`/pos-products/${product.id}`);
      await onUpdated();
    } catch (err) {
      alert("Error eliminando producto");
    }
  }

  async function handleEdit() {
    const newName = prompt("Nuevo nombre:", product.name);
    const newPrice = prompt("Nuevo precio:", product.price);

    if (!newName || !newPrice) return;

    try {
      await api.put(`/pos-products/${product.id}`, {
        name: newName,
        price: Number(newPrice),
      });

      await onUpdated();
    } catch (err) {
      alert("Error actualizando producto");
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl"
      style={{
        backgroundImage: `url(${bgCard})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative p-5 text-white space-y-4">

        <h4 className="text-xl font-black">
          {product.name}
        </h4>

        <p className="text-2xl font-bold">
          ${product.price}
        </p>

        <div className="rounded-2xl bg-white/10 border border-white/10 px-3 py-2">
          <p className="text-xs text-white/60">
            Vendidas
          </p>
          <p className="text-lg font-bold">
            {product.totalSold || 0}
          </p>
        </div>

        {/* BOTONES DE VENTA */}
        <div className="grid grid-cols-3 gap-2">

          <Button
            onClick={() => sell(1)}
            className="rounded-2xl font-bold bg-lime-400 text-black hover:bg-lime-300"
          >
            +1
          </Button>

          <Button
            onClick={() => sell(6)}
            className="rounded-2xl font-bold bg-cyan-400 text-black hover:bg-cyan-300"
          >
            +6
          </Button>

          <Button
            onClick={() => sell(12)}
            className="rounded-2xl font-bold bg-fuchsia-400 text-black hover:bg-fuchsia-300"
          >
            +12
          </Button>

        </div>

        {/* SOLO ADMIN */}
        {isAdmin && (
          <div className="flex gap-2 pt-2">

            <Button
              onClick={handleEdit}
              className="flex-1 rounded-2xl font-bold bg-yellow-400 text-black hover:bg-yellow-300"
            >
              Editar
            </Button>

            <Button
              onClick={handleDelete}
              className="flex-1 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-400"
            >
              Eliminar
            </Button>

          </div>
        )}

      </div>
    </div>
  );
}