import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";


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

                {/* LEFT */}
                <div className="flex items-center gap-8">
                    <div>
                        <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
                            EvenMore
                        </h1>
                        <p className="text-xs text-white/60">
                            Sistema de control
                        </p>
                    </div>

                    {/* NAV LINKS */}
                    <div className="hidden md:flex gap-2">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-xl text-sm font-semibold transition ${isActive
                                    ? "bg-white text-black"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                                }`
                            }
                        >
                            Inventario
                        </NavLink>

                        <NavLink
                            to="/pos"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-xl text-sm font-semibold transition ${isActive
                                    ? "bg-white text-black"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                                }`
                            }
                        >
                            Punto de Venta
                        </NavLink>
                    </div>
                </div>

                {/* RIGHT */}
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
        </div>);
}
