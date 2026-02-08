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

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);


  async function openDetails(inscriptionId) {
    setDetailsLoading(true);
    setShowModal(true);

    try {
      const res = await fetch(
        `${API}/api/inscriptions/${inscriptionId}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");

      setSelected(data);
    } catch (e) {
      alert(e.message);
      setShowModal(false);
    } finally {
      setDetailsLoading(false);
    }
  }



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
      <Link
            to={`/activities/${id}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
          ← Retour à l’activité
      </Link> 
      
      <h1 className="mb-6 text-3xl font-extrabold pt-5">{activity.libelle} - Pré-inscrits</h1>

      <table className="w-full border-collapse border border-slate-300 text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-2 py-1">Nom</th>
            <th className="border border-slate-300 px-2 py-1">Prénom</th>
            <th className="border border-slate-300 px-2 py-1">Téléphone</th>
            <th className="border border-slate-300 px-2 py-1">Date pré-inscription</th>
            <th className="border border-slate-300 px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {preInscrits.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-2">Aucun pré-inscrit</td>
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
              <td className="border px-2 py-1 space-x-2">

                <button
                    className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-200"
                  onClick={() => openDetails(ins.id)}
                >
                  Voir détail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded bg-white p-6">
            {detailsLoading ? (
              <div>Chargement...</div>
            ) : selected && (
              <>
                <h2 className="mb-4 text-xl font-bold">
                  {selected.nom} {selected.prenom}
                </h2>

                {selected.type_compte === "etudiant" && (
                  <div className="space-y-2">
                    <p>
                      <strong>N° carte :</strong>{" "}
                      {selected.etudiant.num_carte_etud}
                    </p>
                    <img
                      src={`${API}/api/documents/${selected.etudiant.img_carte_etud}`}
                      alt="Carte étudiant"
                      className="max-h-64 rounded border"
                    />
                  </div>
                )}

                {selected.type_compte === "personnel" && (
                  <div className="space-y-2">
                    {selected.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={`${API}/api/documents/${doc.chemin}`}
                        target="_blank"
                        className="block text-blue-600 underline"
                      >
                        {doc.type}
                      </a>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    className="rounded bg-gray-300 px-4 py-1"
                    onClick={() => setShowModal(false)}
                  >
                    Fermer
                  </button>
                  <button
                    className="rounded bg-green-600 px-4 py-1 text-white"
                    onClick={() => {
                      handleAction(selected.id, "valider");
                      setShowModal(false);
                    }}
                  >
                    Valider
                  </button>
                  <button
                    className="rounded bg-red-600 px-4 py-1 text-white"
                    onClick={() => {
                      handleAction(selected.id, "refuser");
                      setShowModal(false);
                    }}
                  >
                    Refuser
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
