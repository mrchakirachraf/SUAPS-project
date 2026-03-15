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

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    email: "",
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
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

    // Frontend check for password confirmation
    if (formData.new_password !== formData.new_password_confirmation) {
      setError("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du changement de mot de passe");
      }

      setSuccess("Mot de passe changé avec succès ! Redirection...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen text-slate-900">
      {/* Background */}
      <div className="fixed inset-0 -z-20 bg-white" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#334155]/10 via-white/75 to-[#334155]/10" />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#334155]/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#334155]/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left text */}
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#334155]">
              SUAPS • Université du Littoral Côte d’Opale
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Changer le mot de passe
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Entrez votre email et votre ancien mot de passe pour définir un nouveau mot de passe.
            </p>
          </div>

          {/* Change password card */}
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md sm:p-8">
            <h2 className="text-lg font-extrabold text-slate-900">Changement de mot de passe</h2>
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
                label="Ancien mot de passe"
                type="password"
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <FormInput
                label="Nouveau mot de passe"
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <FormInput
                label="Confirmer le nouveau mot de passe"
                type="password"
                name="new_password_confirmation"
                value={formData.new_password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

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
                {loading ? "Modification..." : "Changer le mot de passe"}
              </button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm font-semibold text-[#334155] hover:underline">
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}