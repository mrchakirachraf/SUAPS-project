import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo (gauche) */}
          <a href="#top" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="SUAPS Univ-Littoral"
              className="w-[85px] h-auto"
            />
          </a>

          {/* Liens et Boutons (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-suaps-blue hover:bg-slate-100"
              >
                Se connecter
              </a>
              <Link
                to="/register"
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                S'inscrire
              </Link>
            </div>
          </div>

          {/* Bouton mobile */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-slate-100"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6 text-suaps-blue"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="mt-2 grid gap-2 rounded-xl border border-slate-200 bg-white p-3">
              <div className="my-2 h-px bg-slate-200" />

              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-suaps-blue hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                onClick={() => setOpen(false)}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
