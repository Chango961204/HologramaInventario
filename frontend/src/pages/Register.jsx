import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import bgLogin from "../assets/EvenMoreLogin.JPEG";
export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            await api.post("/auth/register", {
                name,
                email,
                password,
            });

            navigate("/login");
        } catch (err) {
            console.log("ERROR REGISTER:", err);
            setError(err.response?.data?.message || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
            style={{ backgroundImage: `url(${bgLogin})` }}
        >
            {/* overlay oscuro */}
            <div className="absolute inset-0 bg-black/70"></div>

            {/* card */}
            <form
                onSubmit={handleSubmit}
                className="relative z-10 w-full max-w-md space-y-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl"
            >
                <h1 className="text-3xl font-bold text-white">Crear cuenta</h1>
                <p className="text-white/70 text-sm">
                    Regístrate para usar el inventario
                </p>

                <input
                    className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

                <button
                    disabled={loading}
                    className="w-full rounded-xl bg-white text-black font-semibold p-3 hover:bg-white/90 transition disabled:opacity-60"
                >
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>

                <p className="text-sm text-white/70 mt-2">
                    ¿Ya tienes cuenta?{" "}
                    <Link className="font-semibold text-white underline" to="/login">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
