import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export default function AddMoniteur() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [form, setForm] = useState({
    username: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/auth/register/moniteur`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");

      navigate("/admin/users");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen text-slate-900">
      {/* Background */}
      <div className="fixed inset-0 -z-20 bg-white" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#205187]/10 via-white/75 to-[#334155]/10" />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#205187]/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#334155]/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#205187]">
              SUAPS • Université du Littoral Côte d’Opale
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
              Ajouter un moniteur
            </h1>
          </div>

          <Link
            to="/admin/users"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            ← Retour
          </Link>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white/75 p-8 shadow-sm backdrop-blur-md">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                placeholder="Username"
                value={form.username}
                onChange={(e) => onChange("username", e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#205187] focus:ring-4 focus:ring-[#205187]/10"
              />

              <input
                required
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#205187] focus:ring-4 focus:ring-[#205187]/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                required
                placeholder="Nom"
                value={form.nom}
                onChange={(e) => onChange("nom", e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#205187] focus:ring-4 focus:ring-[#205187]/10"
              />

              <input
                required
                placeholder="Prénom"
                value={form.prenom}
                onChange={(e) => onChange("prenom", e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#205187] focus:ring-4 focus:ring-[#205187]/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={(e) => onChange("password", e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#205187] focus:ring-4 focus:ring-[#205187]/10"
              />

              <input
                required
                type="password"
                placeholder="Confirmer mot de passe"
                value={form.password_confirmation}
                onChange={(e) =>
                  onChange("password_confirmation", e.target.value)
                }
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#205187] focus:ring-4 focus:ring-[#205187]/10"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                disabled={loading}
                className="rounded-xl bg-[#334155] px-6 py-3 text-sm font-extrabold text-white hover:opacity-95 disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer le moniteur"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
