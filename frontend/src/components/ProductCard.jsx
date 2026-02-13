import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MovementModal from "./MovementModal";
import bgCard from "../assets/EvenMore3Cards.JPEG";
import { useNavigate } from "react-router-dom";

// shadcn
import { Button } from "@/components/ui/button";

// icons
import {
  Pencil,
  Trash2,
  Plus,
  Minus,
  Save,
  X,
} from "lucide-react";

export default function ProductCard({ product, onUpdated }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price);

  const [openIN, setOpenIN] = useState(false);
  const [openOUT, setOpenOUT] = useState(false);

  async function handleDelete() {
    try {
      if (!confirm("¿Eliminar producto?")) return;

      await api.delete(`/products/${product.id}`);
      onUpdated();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Error eliminando producto");
    }
  }

  async function handleSave() {
    try {
      await api.put(`/products/${product.id}`, {
        name,
        description,
        price: Number(price || 0),
      });

      setEditing(false);
      onUpdated();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Error actualizando producto");
    }
  }

  async function handleMovement(type, data) {
    try {
      await api.post(`/movements/${product.id}`, {
        type,
        quantity: Number(data.quantity || 0),
        note: data.note,
      });

      setOpenIN(false);
      setOpenOUT(false);
      onUpdated();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Error registrando movimiento");
    }
  }

  return (
    <div
      onDoubleClick={() => navigate(`/products/${product.id}`)}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl cursor-pointer"
      style={{
        backgroundImage: `url(${bgCard})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative p-5">
        {!editing ? (
          <div className="flex flex-col gap-4">
            {/* top */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-xl font-black text-white">
                  {product.name}
                </h4>

                {product.description && (
                  <p className="text-sm text-white/70 mt-1">
                    {product.description}
                  </p>
                )}
              </div>

              {isAdmin && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing(true);
                    }}
                    className="rounded-2xl bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="rounded-2xl"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              )}
            </div>

            {/* stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="rounded-2xl bg-white/10 border border-white/10 px-3 py-2 text-white">
                <p className="text-[11px] text-white/60">Precio</p>
                <p className="font-bold">${product.price}</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 px-3 py-2 text-white">
                <p className="text-[11px] text-white/60">Entradas</p>
                <p className="font-bold">{product.totalIN}</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 px-3 py-2 text-white">
                <p className="text-[11px] text-white/60">Vendidas</p>
                <p className="font-bold">{product.totalOUT}</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 px-3 py-2 text-white">
                <p className="text-[11px] text-white/60">Stock actual</p>
                <p className="font-bold">{product.stockActual}</p>
              </div>
            </div>

            {/* totals + actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <p className="text-white/70 text-sm">
                Total a pagar:{" "}
                <span className="font-black text-white">
                  ${product.totalToPay}
                </span>
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenIN(true);
                  }}
                  className="flex-1 sm:flex-none rounded-2xl font-black bg-lime-400 text-black hover:bg-lime-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Entrada
                </Button>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenOUT(true);
                  }}
                  className="flex-1 sm:flex-none rounded-2xl font-black bg-cyan-400 text-black hover:bg-cyan-300"
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Venta
                </Button>
              </div>
            </div>

            {product.createdBy?.name && (
              <p className="text-xs text-white/40">
                Creado por: {product.createdBy.name}
              </p>
            )}

            <p className="text-[11px] text-white/40">
              💡 Tip: doble tap para ver historial
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              className="w-full rounded-2xl bg-white/10 border border-white/10 p-3 text-white outline-none focus:ring-2 focus:ring-white/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />

            <input
              className="w-full rounded-2xl bg-white/10 border border-white/10 p-3 text-white outline-none focus:ring-2 focus:ring-white/30"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />

            <input
              className="w-full rounded-2xl bg-white/10 border border-white/10 p-3 text-white outline-none focus:ring-2 focus:ring-white/30"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />

            <div className="flex gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="flex-1 rounded-2xl font-bold"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>

              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(false);
                }}
                className="flex-1 rounded-2xl bg-white/10 text-white hover:bg-white/20 border border-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <MovementModal
        open={openIN}
        type="IN"
        onClose={() => setOpenIN(false)}
        onConfirm={(data) => handleMovement("IN", data)}
      />

      <MovementModal
        open={openOUT}
        type="OUT"
        onClose={() => setOpenOUT(false)}
        onConfirm={(data) => handleMovement("OUT", data)}
      />
    </div>
  );
}
