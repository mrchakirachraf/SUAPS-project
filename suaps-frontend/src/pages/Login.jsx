import { useState } from "react";
import { Link } from "react-router-dom";

/* Reusable input (same as Register) */
function FormInput({ label, className = "", ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-100">
        {label}
      </label>
      <input
        {...props}
        className={
          "w-full rounded-xl border border-white/15 bg-white/90 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#205187] focus:ring-4 focus:ring-[#205187]/25 " +
          className
        }
      />
    </div>
  );
}

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", formData);
    // TODO: connect to Laravel auth API
  };

  return (
    <main className="relative min-h-screen text-white">
      {/* Fixed background */}
      <div className="fixed inset-0 -z-20 bg-black">
        <img
          src="/basketball-player-action-sunset 1.png"
          alt="Basketball Player"
          className="h-full w-full object-contain object-right"
        />
      </div>

      {/* Color overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#205187]/80 via-black/70 to-[#E33A3B]/60" />

      {/* Soft layer */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left text */}
          <div>
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              SUAPS • Université du Littoral Côte d’Opale
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Se connecter
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              Connectez-vous pour accéder à votre espace personnel et gérer vos
              activités sportives.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-sm font-extrabold">Accès sécurisé</div>
                <div className="mt-1 text-sm text-white/80">
                  Authentification protégée et données sécurisées.
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-sm font-extrabold">Espace personnalisé</div>
                <div className="mt-1 text-sm text-white/80">
                  Accédez à vos inscriptions et validations.
                </div>
              </div>
            </div>
          </div>

          {/* Login card */}
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-sm backdrop-blur-md sm:p-8">
            <h2 className="text-lg font-extrabold">Connexion</h2>
            <p className="mt-1 text-sm text-white/80">
              Entrez vos identifiants pour continuer.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <FormInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="prenom.nom@univ-littoral.fr"
                required
              />

              <FormInput
                label="Mot de passe"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">
                  Mot de passe oublié ?
                </span>
                <Link
                  to="/register"
                  className="font-semibold text-white hover:underline"
                >
                  Créer un compte
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#205187] px-6 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-[#205187]/30"
              >
                Se connecter
              </button>

              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm font-semibold text-white/80 hover:text-white hover:underline"
                >
                  ← Retour à l’accueil
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
