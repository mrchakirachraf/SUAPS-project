import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export default function ActivityPreInscrits() {
  const { id } = useParams();
  const token = localStorage.getItem("access_token");

  const [activity, setActivity] = useState(null);
  const [preInscrits, setPreInscrits] = useState([]);
  const [inscrits, setInscrits] = useState([]);
  const [notes, setNotes] = useState({});
  const [isEvaluated, setIsEvaluated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // --- Fonction pour charger les pré-inscrits ---
  async function loadPreInscrits() {
    try {
      const res = await fetch(`${API}/api/activites/${id}/preinscrits`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");
      setActivity({ libelle: data.libelle });
      setPreInscrits(data.preInscrits);
    } catch (e) {
      setError(e.message);
    }
  }

  // --- Fonction pour charger les inscrits ---
  async function loadInscrits() {
    try {
      const res = await fetch(`${API}/api/activites/${id}/inscrits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInscrits(data.inscrits);
      setIsEvaluated(data.est_evaluee);

      const initialNotes = {};
      data.inscrits.forEach(i => {
        initialNotes[i.etudiant_id] = i.note ?? "";
      });
      setNotes(initialNotes);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      await Promise.all([loadPreInscrits(), loadInscrits()]);
      setLoading(false);
    }
    loadAll();
  }, [id]);

  // --- Détails pré-inscription ---
  async function openDetails(inscriptionId) {
    setDetailsLoading(true);
    setShowModal(true);
    try {
      const res = await fetch(`${API}/api/inscriptions/${inscriptionId}/details`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
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

  // --- Action valider/refuser ---
  async function handleAction(inscriptionId, action) {
    try {
      const res = await fetch(`${API}/api/inscriptions/${inscriptionId}/valider`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");

      // Rafraîchir pré-inscrits et inscrits après action
      await Promise.all([loadPreInscrits(), loadInscrits()]);
      setShowModal(false);
    } catch (e) {
      alert(e.message);
    }
  }

  async function confirmAction(action) {
    if (selected) await handleAction(selected.id, action);
  }


  async function saveSingleNote(etudiant_id) {
    try {
      const res = await fetch(`${API}/api/evaluations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activite_id: id,
          etudiant_id,
          note: notes[etudiant_id] === "" ? null : notes[etudiant_id],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");

      alert("Note enregistrée");
    } catch (e) {
      alert(e.message);
    }
  }


  if (loading)
    return (
      <main className="relative min-h-screen text-slate-900">
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
            <h2 className="text-lg font-extrabold text-red-700">Une erreur est survenue</h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );

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

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold my-6">{activity.libelle}</h2>
          <Link
            to={`/activities/${id}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            ← Retour à l’activité
          </Link>
        </div>

        {preInscrits.length > 0 && (
          <>          
          <h1 className="text-xl font-extrabold my-6">Liste des pré-inscrits</h1>
          <div className="mt-6 rounded-3xl border bg-white/70 p-6 backdrop-blur">
          <table className="w-full text-sm">
            <thead className="text-slate-500">
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Téléphone</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>

            <tbody className="divide-y">
              {preInscrits.map(ins => (
                <tr key={ins.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3">{ins.nom}</td>
                  <td>{ins.prenom}</td>
                  <td>{ins.num_tel_etud || "—"}</td>
                  <td>
                    {new Date(ins.date_pre_inscription).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => openDetails(ins.id)}
                      className="inline-flex items-center rounded-full border border-[#205187] bg-white/80 px-3 py-1 text-xs font-semibold text-[#205187] hover:bg-[#205187]/10 transition"
                    >
                      Voir détail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          </>
        )}

      {/* ✨ Modern Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-2xl animate-[fadeIn_.25s_ease-out] rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
            
            {detailsLoading ? (
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#205187]" />
                Chargement des détails…
              </div>
            ) : selected && (
              <>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#205187]">
                      Détails de la pré-inscription
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                      {selected.nom} {selected.prenom}
                    </h2>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="my-6 h-px bg-slate-200" />

                {/* Student */}
                {selected.type_compte === "etudiant" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        Numéro de carte étudiant
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {selected.etudiant.num_carte_etud}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                      <p className="mb-3 text-xs font-semibold text-slate-500">
                        Carte étudiante
                      </p>
                      <img
                        src={`${API}/api/documents/${selected.etudiant.img_carte_etud}`}
                        alt="Carte étudiant"
                        className="max-h-72 w-full rounded-xl border border-slate-200 object-contain shadow-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Personnel */}
                {selected.type_compte === "personnel" && (
                  <div className="space-y-4">
                    {selected.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={`${API}/api/documents/${doc.chemin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-[#205187] transition hover:bg-[#205187]/5"
                      >
                        📄 {doc.type}
                      </a>
                    ))}
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Fermer
                  </button>

                  <button
                    onClick={() => confirmAction("refuser")}
                    className="rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95"
                  >
                    Refuser
                  </button>

                  <button
                    onClick={() => confirmAction("valider")}
                    className="rounded-xl bg-[#205187] px-5 py-2 text-sm font-bold text-white transition hover:opacity-95 active:scale-95"
                  >
                    Valider
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}


        {inscrits.length > 0 && (
        <>
        <h2 className="text-xl font-extrabold my-6">Liste des inscrits</h2>
        <div className="mt-6 rounded-3xl border bg-white/70 p-6 backdrop-blur">
          <table className="w-full text-sm">
            <thead className="text-slate-500">
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                {isEvaluated && <th>Note</th>}
              </tr>
            </thead>

            <tbody className="divide-y">
              {inscrits.map(i => {
                const hasNote = notes[i.etudiant_id] !== "" && notes[i.etudiant_id] !== null;

                return (
                  <tr key={i.etudiant_id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3">{i.nom}</td>
                    <td>{i.prenom}</td>

                    {isEvaluated && (
                      <td>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={notes[i.etudiant_id]}
                            onChange={e =>
                              setNotes({ ...notes, [i.etudiant_id]: e.target.value })
                            }
                            className={`w-20 rounded-xl border px-2 py-1 text-sm
                              ${hasNote
                                ? "border-green-400 bg-green-50"
                                : "border-slate-300 bg-white"
                              }`}
                          />

                          <button
                            onClick={() => saveSingleNote(i.etudiant_id)}
                            className="inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                          >
                            Enregistrer
                          </button>

                          {hasNote && (
                            <span className="text-xs font-semibold text-green-600">
                              ✔
                            </span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {isEvaluated && (
            <button
              className="mt-6 rounded-xl bg-[#334155] px-6 py-2 font-extrabold text-white hover:bg-[#1e293b] transition"
              onClick={async () => {
                await fetch(`${API}/api/evaluations/bulk`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    activite_id: id,
                    notes: Object.entries(notes).map(([etudiant_id, note]) => ({
                      etudiant_id,
                      note,
                    })),
                  }),
                });
                alert("Notes enregistrées");
              }}
            >
              Enregistrer toutes les notes
            </button>
          )}
        </div>
        </>
      )}
      </div>
      
    </main>
  );
}
