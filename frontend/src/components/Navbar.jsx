import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
                        Inventario EvenMore
                    </h1>
                    <p className="text-xs text-white/60">
                        Control rápido y sencillo de productos
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-white/60">{user?.role}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-xl bg-white text-black px-4 py-2 text-sm font-bold hover:bg-white/90 transition"
                    >
                        Salir
                    </button>
                </div>
            </div>
        </div>
    );
}
