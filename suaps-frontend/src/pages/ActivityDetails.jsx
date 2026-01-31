import { useEffect, useState } from "react";
import { useNavigate , Link, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR");
}

export default function ActivityDetails() {
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const canRegister =
  user &&
  (user.etudiant != null || user.personnel != null);
  const isQuotaFull =
    user?.etudiant != null
      ? activity?.quota_etudiant <= 0
      : user?.personnel != null
      ? activity?.quota_personnel <= 0
      : true;



  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setErr("");

        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API}/api/activites/${id}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Impossible de charger l’activité.");

        setActivity(data);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Erreur réseau.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

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

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Top bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#205187]">
              SUAPS • Université du Littoral Côte d’Opale
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Détails de l’activité
            </h1>
          </div>

          <Link
            to="/activities"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            ← Retour à la liste
          </Link>
        </div>

        {/* States */}
        {loading && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur-md">
            Chargement...
          </div>
        )}

        {err && !loading && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {err}
          </div>
        )}

        {!loading && !err && activity && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Main card */}
            <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white/75 p-6 shadow-sm backdrop-blur-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {activity.libelle}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {activity.jour ? `${activity.jour}` : "—"}{" "}
                    {activity.horaire ? `• ${activity.horaire}` : ""}{" "}
                    {activity.periode ? `• ${activity.periode}` : ""}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge>{activity.categorie?.nom ?? "—"}</Badge>
                  <Badge>{activity.typeEvenement?.libelle ?? "—"}</Badge>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="text-xs font-semibold text-slate-500">Lieu</div>
                  <div className="mt-1 font-extrabold text-slate-900">
                    {activity.lieu ?? activity.site?.nom ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="text-xs font-semibold text-slate-500">Statut</div>
                  <div className="mt-1 font-extrabold text-slate-900">
                    {activity.statut ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="text-xs font-semibold text-slate-500">Quotas</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    Étudiants: {activity.quota_etudiant ?? "—"} • Personnel:{" "}
                    {activity.quota_personnel ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="text-xs font-semibold text-slate-500">Visibilité</div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {activity.visible ? "Visible" : "Masquée"}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge>Inscr. S1: {formatDate(activity.date_limite_inscription_s1)}</Badge>
                <Badge>Notes S1: {formatDate(activity.date_limite_note_s1)}</Badge>
                <Badge>Inscr. S2: {formatDate(activity.date_limite_inscription_s2)}</Badge>
                <Badge>Notes S2: {formatDate(activity.date_limite_note_s2)}</Badge>
              </div>
            </div>

            {/* Side card */}
            <aside className="rounded-3xl border border-slate-200 bg-white/75 p-6 shadow-sm backdrop-blur-md">
              <h3 className="text-base font-extrabold text-slate-900">Moniteur</h3>
              <p className="mt-2 text-sm text-slate-600">
                {activity.moniteur?.user
                  ? `${activity.moniteur.user.prenom ?? ""} ${activity.moniteur.user.nom ?? ""}`.trim()
                  : "—"}
              </p>

              <div className="mt-6 h-px bg-slate-200" />

              <h3 className="mt-6 text-base font-extrabold text-slate-900">Inscriptions</h3>
              <p className="mt-2 text-sm text-slate-600">
                Total inscriptions:{" "}
                <span className="font-extrabold text-slate-900">
                  {Array.isArray(activity.inscriptions) ? activity.inscriptions.length : 0}
                </span>
              </p>

              <h3 className="mt-6 text-base font-extrabold text-slate-900">Évaluations</h3>
              <p className="mt-2 text-sm text-slate-600">
                Total évaluations:{" "}
                <span className="font-extrabold text-slate-900">
                  {Array.isArray(activity.evaluations) ? activity.evaluations.length : 0}
                </span>
              </p>

              {canRegister && (
                <>
                  <div className="mt-6 h-px bg-slate-200" />

                  <button
                    disabled={isQuotaFull}
                    onClick={() => navigate(`/activities/${id}/register`)}
                    className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-extrabold transition
                      ${
                        isQuotaFull
                          ? "cursor-not-allowed bg-slate-200 text-slate-500"
                          : "bg-[#205187] text-white hover:bg-[#163b63]"
                      }`}
                  >
                    {isQuotaFull
                      ? "Quota atteint"
                      : "S’inscrire à cette activité"}
                  </button>
                </>
              )}

            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
