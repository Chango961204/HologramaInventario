import bgLogin from "../assets/EvenMoreLogin.JPEG";

export default function AppLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${EvenMore})` }}
    >
      {/* overlay oscuro para que se lea bien */}
      <div className="min-h-screen bg-black/60">
        {children}
      </div>
    </div>
  );
}
