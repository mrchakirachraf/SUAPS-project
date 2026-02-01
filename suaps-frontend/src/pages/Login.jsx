import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function FormInput({ label, className = "", ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        {...props}
        className={
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#334155] focus:ring-4 focus:ring-[#334155]/15 " +
          className
        }
      />
    </div>
  );
}

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Identifiants incorrects");
      }

      // ✅ Stockage du token
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data));
      
      window.dispatchEvent(new Event("auth:changed"));

      console.log("Connexion réussie", data);
      setSuccess("Connexion réussie! Redirection en cours...");

      setTimeout(() => navigate("/activities"), 1500);

    

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="relative min-h-screen text-slate-900">
      {/* ✅ Fixed background image (fresh) */}
      <div className="fixed inset-0 -z-20 bg-white">
        <img
          src="/basketball-player-action-sunset 1.png"
          alt="Basketball Player"
          className="h-full w-full object-contain object-right opacity-85"
        />
      </div>

      {/* ✅ Fresh clear overlay (NO BLACK) */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#334155]/10 via-white/75 to-[#334155]/10" />

      {/* ✅ Soft frosted layer */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#334155]/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#334155]/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left text */}
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#334155]">
              SUAPS • Université du Littoral Côte d’Opale
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Se connecter
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Connectez-vous pour accéder à votre espace personnel et gérer vos
              activités sportives.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-md">
                <div className="text-sm font-extrabold text-slate-900">Accès sécurisé</div>
                <div className="mt-1 text-sm text-slate-600">
                  Authentification protégée et données sécurisées.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-md">
                <div className="text-sm font-extrabold text-slate-900">Espace personnalisé</div>
                <div className="mt-1 text-sm text-slate-600">
                  Accédez à vos inscriptions et validations.
                </div>
              </div>
            </div>
          </div>

          {/* Login card */}
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md sm:p-8">
            <h2 className="text-lg font-extrabold text-slate-900">Connexion</h2>
            <p className="mt-1 text-sm text-slate-600">
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

              <div className="flex items-center justify-between  text-sm">
                <span className="text-slate-500">Mot de passe oublié ?</span>

                <Link to="/register" className="font-semibold text-[#334155] hover:underline">
                  Créer un compte
                </Link>
              </div>

              {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}


              <button
                type="submit"
                disabled={loading || success}
                className="w-full rounded-xl bg-[#334155] px-6 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-[#334155]/25 disabled:opacity-60"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>


              <div className="text-center">
                <Link to="/" className="text-sm font-semibold text-[#334155] hover:underline">
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
