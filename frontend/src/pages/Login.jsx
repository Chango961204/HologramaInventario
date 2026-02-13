import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios"; 
import bgLogin from "../assets/EvenMoreLogin.JPEG";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN OK:", res.data);

      login(res.data);
      navigate("/dashboard");
    } catch (error) {
      console.log("ERROR LOGIN:", error);
      console.log("DATA:", error?.response?.data);
      alert(error?.response?.data?.message || "Error en login");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-white">
          Inventario EvenMore
        </h1>
        <p className="text-white/70 text-sm">
          Inicia sesión para continuar
        </p>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Email"
        />

        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-white text-black font-semibold p-3 hover:bg-white/90 transition disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-sm text-white/70 text-center pt-2">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-white underline hover:text-white/90"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
