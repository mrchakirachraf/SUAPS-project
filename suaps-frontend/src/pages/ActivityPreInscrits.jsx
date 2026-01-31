import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export default function ActivityPreInscrits() {
  const { id } = useParams();
  const token = localStorage.getItem("access_token");

  const [activity, setActivity] = useState(null);
  const [preInscrits, setPreInscrits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/activites/${id}/preinscrits`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur");
        setActivity({ libelle: data.libelle });
        setPreInscrits(data.preInscrits);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleAction(inscriptionId, action, note) {
    try {
      const res = await fetch(`${API}/api/inscriptions/${inscriptionId}/valider`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");
      // mise à jour frontend
      setPreInscrits(preInscrits.filter(i => i.id !== inscriptionId));
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link to={`/activities/${id}`} className="text-sm font-extrabold text-[#205187]">
        ← Retour à l’activité
      </Link>

      <h1 className="mb-6 text-3xl font-extrabold">{activity.libelle} - Pré-inscrits</h1>

      <table className="w-full border-collapse border border-slate-300 text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-2 py-1">Nom</th>
            <th className="border border-slate-300 px-2 py-1">Prénom</th>
            <th className="border border-slate-300 px-2 py-1">Téléphone</th>
            <th className="border border-slate-300 px-2 py-1">Date pré-inscription</th>
            <th className="border border-slate-300 px-2 py-1">Note</th>
            <th className="border border-slate-300 px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {preInscrits.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-2">Aucun pré-inscrit</td>
            </tr>
          )}
          {preInscrits.map((ins) => (
            <tr key={ins.id}>
              <td className="border px-2 py-1">{ins.nom}</td>
              <td className="border px-2 py-1">{ins.prenom}</td>
              <td className="border px-2 py-1">{ins.num_tel_etud || "—"}</td>
              <td className="border px-2 py-1">
                {new Date(ins.date_pre_inscription).toLocaleDateString("fr-FR")}
              </td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  className="w-16 border rounded px-1 py-0.5 text-sm"
                  onChange={(e) =>
                    (ins.note = parseFloat(e.target.value))
                  }
                />
              </td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  className="rounded bg-green-600 px-3 py-1 text-white"
                  onClick={() => handleAction(ins.id, "valider", ins.note)}
                >
                  Valider
                </button>
                <button
                  className="rounded bg-red-600 px-3 py-1 text-white"
                  onClick={() => handleAction(ins.id, "refuser")}
                >
                  Refuser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
