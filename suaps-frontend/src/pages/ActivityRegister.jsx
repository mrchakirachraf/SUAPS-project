import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function AlertBox({ text, onClose }) {
  return (
    <div className="mb-8 rounded-3xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-900">
      <h3 className="mb-2 text-base font-extrabold">
        Informations importantes avant inscription
      </h3>
      <p className="whitespace-pre-line">{text || "—"}</p>

      <button
        onClick={onClose}
        className="mt-4 rounded-xl bg-[#205187] px-4 py-2 text-sm font-extrabold text-white hover:bg-[#163b63]"
      >
        J’ai compris
      </button>
    </div>
  );
}

export default function ActivityRegister() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access_token");

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAlert, setShowAlert] = useState(true);
  const [numTel, setNumTel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dateLimite, setDateLimite] = useState(null);


  useEffect(() => {
    if (!activity || !activity.periode) {
      setDateLimite(null);
      return;
    }

    const periodes = activity.periode.split("/"); // ex: "S1/S2" → ["S1","S2"]
    const limites = [];

    if (periodes.includes("S1") && activity.date_limite_inscription_s1) {
      limites.push({ periode: "S1", date: activity.date_limite_inscription_s1 });
    }

    if (periodes.includes("S2") && activity.date_limite_inscription_s2) {
      limites.push({ periode: "S2", date: activity.date_limite_inscription_s2 });
    }

    setDateLimite(limites.length > 0 ? limites : null);
  }, [activity]);





  useEffect(() => {
    if (activity && !activity.description_pre_inscription) {
        setShowAlert(false);
    }
    }, [activity]);


  // 🔹 Load activity
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch(`${API}/api/activites/${id}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setActivity(data);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);
  

  // 🔹 Submit inscription
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `${API}/api/activites/${id}/inscriptions`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            num_tel_etud:
              user?.type_compte === "etudiant" ? numTel : null,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ succès → retour détail activité
      navigate(`/activities/${id}`);
    } catch (e) {
      setError(e.message || "Erreur lors de l’inscription.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-slate-600">
        Chargement...
      </div>
    );
  }

  if (error && !activity) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        to={`/activities/${id}`}
        className="mb-6 inline-block text-sm font-extrabold text-[#205187]"
      >
        ← Retour à l’activité
      </Link>

      <h1 className="mb-6 text-3xl font-extrabold">
        Inscription à l’activité
      </h1>

      {/* 🔔 Alert box */}
      {showAlert && activity?.description_pre_inscription?.trim() && (
        <AlertBox
            text={activity.description_pre_inscription}
            onClose={() => setShowAlert(false)}
        />
        )}


      {!showAlert && (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h2 className="text-xl font-extrabold">
            {activity.libelle}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {activity.jour || "—"} • {activity.horaire || "—"} • {activity.periode}
            </p>    

          {dateLimite && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-700">
              <span className="font-extrabold text-slate-900">
                Date(s) limite(s) d’inscription :
              </span>{" "}
              {dateLimite.map((d, i) => (
                <span key={i}>
                  {d.periode}: {new Date(d.date).toLocaleDateString("fr-FR")}
                  {i < dateLimite.length - 1 ? " • " : ""}
                </span>
              ))}
            </div>
          )}



            {/* 📝 Commentaire */}
            {activity.commentaire && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                <span className="font-semibold">Commentaire :</span>
                <p className="mt-1 whitespace-pre-line">
                {activity.commentaire}
                </p>
            </div>
            )}

            

          <div className="mt-6 h-px bg-slate-200" />

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Étudiant uniquement */}
            {user?.type_compte === "etudiant" && (
              <div>
                <label className="block text-sm font-semibold">
                  Numéro de téléphone
                </label>
                <input
                  type="text"
                  value={numTel}
                  onChange={(e) => setNumTel(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm"
                  placeholder="06 12 34 56 78"
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              disabled={submitting}
              className="w-full rounded-xl bg-[#205187] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#163b63] disabled:opacity-60"
            >
              {submitting
                ? "Inscription en cours..."
                : "Confirmer mon inscription"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
