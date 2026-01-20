import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // 🔐 Check auth status
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  // 📱 Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="SUAPS Univ-Littoral"
              className="w-[85px] h-auto"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-slate-100"
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-[#334155] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="rounded-lg bg-[#334155] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e293b]"
              >
                Se déconnecter
              </button>
            )}
          </div>

          {/* Mobile button */}
          <button
            className="md:hidden rounded-lg p-2 hover:bg-slate-100"
            onClick={() => setOpen(!open)}
          >
            <svg
              className="h-6 w-6 text-[#334155]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-3 rounded-xl border border-slate-200 bg-white p-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#334155] hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="block rounded-lg bg-[#334155] px-3 py-2 text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="rounded-lg bg-[#334155] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e293b]"
              >
                Se déconnecter
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
