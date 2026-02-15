import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";



export default function SecretariatsAdmin() {
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  const emptyForm = { nom: "", prenom: "", email: "", telephone: "" };
  const [form, setForm] = useState(emptyForm);

  const isInvalid =
  !form.nom || !form.prenom || !form.email || !form.telephone;


  function resetForm() {
        setForm(emptyForm);
        setEditing(null);
    }


  // 🔐 protection SUAPS
  useEffect(() => {
    if (!user || user.type_compte !== "suaps") {
      navigate("/activities");
    }
  }, [user, navigate]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/secretariats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur");
        setItems(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        editing
          ? `${API}/api/secretariats/${editing}`
          : `${API}/api/secretariats`,
        {
          method: editing ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");

      setItems((prev) =>
        editing
          ? prev.map((i) => (i.id === editing ? data : i))
          : [...prev, data]
      );

      setForm(emptyForm);
      setEditing(null);
    } catch (e) {
      alert(e.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer ce secrétariat ?")) return;

    await fetch(`${API}/api/secretariats/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (loading)
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

        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#205187]" />
              Chargement…
            </div>
          </div>
        </div>
      </main>
    );

  if (error)
      return (
        <main className="relative min-h-screen px-32 text-slate-900">
          {/* Background */}
          <div className="fixed inset-0 -z-20 bg-white" />
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#205187]/10 via-white/75 to-[#334155]/10" />
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#205187]/10 blur-3xl" />
            <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#334155]/10 blur-3xl" />
          </div>
          <div className="mt-6">
            <Link
              to="/activities"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
            >
              ← Retour aux activités
            </Link>
          </div>
          <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
            <div className="flex flex-col justify-center items-center w-full max-w-md rounded-3xl border border-red-200 bg-red-50/80 p-8 shadow-sm backdrop-blur-md">
              <h2 className="text-lg font-extrabold text-red-700">
                Une erreur est survenue
              </h2>

              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </main>
      );

  return (
    <main className="relative min-h-screen text-slate-900">
    <div className="fixed inset-0 -z-20 bg-white" />
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#205187]/10 via-white/75 to-[#334155]/10" />
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#205187]/10 blur-3xl" />
      <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#334155]/10 blur-3xl" />
    </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#205187]">
                SUAPS • Université du Littoral Côte d’Opale
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Gestion des secrétariats
            </h1>
          </div>

          <Link
            to="/activities"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            ← Retour aux activités
          </Link>
        </div>

        {/* Form */}
        <form
          onSubmit={submit}
          className="mt-8 grid gap-4 rounded-3xl border bg-white/70 p-6 backdrop-blur"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Nom *" value={form.nom} required
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="rounded-xl border px-3 py-2" />
            <input placeholder="Prénom *" value={form.prenom} required
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              className="rounded-xl border px-3 py-2" />
            <input placeholder="Email *" value={form.email} required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-xl border px-3 py-2" />
            <input placeholder="Téléphone *" value={form.telephone} required
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              className="rounded-xl border px-3 py-2" />
          </div>

          <div className="flex flex-row-reverse gap-3">
                <button
                    disabled={isInvalid}
                    className={`rounded-xl px-6 py-2 font-extrabold text-white ${
                        isInvalid
                        ? "cursor-not-allowed bg-slate-300"
                        : "bg-[#334155] hover:bg-[#1e293b]"
                    }`}
                    >
                    {editing ? "Mettre à jour" : "Ajouter"}
                </button>


                {editing && (
                    <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                    Réinitialiser
                    </button>
                )}
            </div>

        </form>

        {/* Table */}
        <div className="mt-8 rounded-3xl border bg-white/70 p-6 backdrop-blur">
          <table className="w-full text-sm">
            <thead className="text-slate-500">
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th >Téléphone</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((s) => (
                <tr key={s.id}>
                  <td>{s.nom}</td>
                  <td>{s.prenom}</td>
                  <td>{s.email}</td>
                  <td>{s.telephone ?? "—"}</td>
                  <td className="flex justify-center gap-2 py-2">
                    <button
                        onClick={() => {
                        setEditing(s.id);
                        setForm(s);
                        }}
                        className="inline-flex items-center rounded-full border border-[#205187] bg-white/80 px-3 py-1 text-xs font-semibold text-[#205187] hover:bg-[#205187]/10 transition"
                    >
                        Modifier
                    </button>

                    <button
                        onClick={() => remove(s.id)}
                        className="inline-flex items-center rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                    >
                        Supprimer
                    </button>
                   </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
