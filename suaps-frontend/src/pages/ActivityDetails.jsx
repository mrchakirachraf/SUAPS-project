import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GiSportMedal } from "react-icons/gi";
import {
  GiSoccerBall,
  GiBasketballBall,
  GiVolleyballBall,
  GiRunningShoe,
  GiShuttlecock,
  GiWaterSplash,
  GiWeightLiftingUp,
  GiHand,
} from "react-icons/gi";

const CATEGORY_ICONS = {
  Football: GiSoccerBall,
  Basketball: GiBasketballBall,
  Handball: GiHand,
  Volleyball: GiVolleyballBall,
  Natation: GiWaterSplash,
  Musculation: GiWeightLiftingUp,
  "Athlétisme": GiRunningShoe,
  Badminton: GiShuttlecock,
};

const getCategoryIcon = (name) => CATEGORY_ICONS[name] ?? GiSportMedal;

// ✅ category name -> public/categories/<file>
const CATEGORY_IMAGES = {
  Football: "football.png",
  Basketball: "basketball.png",
  Handball: "handball.jpg",
  Volleyball: "volleyball.jpg",
  Natation: "natation.png",
  Musculation: "musculation.png",
  "Athlétisme": "athletisme.png", // keep accent IF your file name has it
  Badminton: "badminton.png",
};

// returns "/categories/xxx.png" or null
function getCategoryImageSrc(categoryName) {
  const file = CATEGORY_IMAGES[categoryName];
  return file ? `/categories/${file}` : null;
}



const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

/** ✅ Reads exactly what your login stores:
 * localStorage:
 * - access_token: string
 * - user: JSON string with { message, access_token, token_type, type_compte, user: {...} }
 */
function readAuth() {
  const token = localStorage.getItem("access_token");

  let payload = null;
  try {
    payload = JSON.parse(localStorage.getItem("user"));
  } catch {
    payload = null;
  }

  // IMPORTANT: backend returns "user" key containing the actual user object
  const u = payload?.user ?? null;

  const isSuaps = Boolean(u?.moniteur?.is_suaps); // ✅ already provided by login
  const isMoniteur = Boolean(u?.moniteur);

  return { token, user: u, isSuaps, isMoniteur };
}

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
  const navigate = useNavigate();

  // ✅ load auth once (single source of truth)
  const [{ token, user, isSuaps, isMoniteur }] = useState(() => readAuth());

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);


  const canRegister = Boolean(user?.etudiant || user?.personnel);

  const isQuotaFull = useMemo(() => {
    if (!activity || !user) return true;

    if (user.etudiant) return (activity.quota_etudiant ?? 0) <= 0;
    if (user.personnel) return (activity.quota_personnel ?? 0) <= 0;

    return true;
  }, [activity, user]);

  const isOuverte = (activity?.statut ?? "").toLowerCase() === "ouverte";

  

  const canSeePreinscrits = useMemo(() => {
    if (!user || !activity) return false;

    if (isSuaps) return true;

    const moniteurs = activity.moniteurs ?? [];

    return moniteurs.some((m) => m.id === user?.moniteur?.id);
  }, [user, activity, isSuaps]);

  

  const categorie = activity?.categorie?.nom ?? "—";
  const CategoryIcon = getCategoryIcon(categorie);
  const categoryImg = getCategoryImageSrc(categorie);


  const isVisible = activity?.visible === 1 || activity?.visible === true;


  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setErr("");

        const headers = {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // ✅ only SUAPS + token uses manage endpoint
        const endpoint =
          token && isSuaps
            ? `/api/activites/manage/${id}`
            : `/api/activites/${id}`;

        const res = await fetch(`${API}${endpoint}`, {
          signal: controller.signal,
          headers,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Impossible de charger l’activité.");
        console.log(data)
        setActivity(data);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Erreur réseau.");
      } finally {
        setLoading(false);
      }
    }


    load();
    return () => controller.abort();
  }, [id, token, isSuaps]);

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
                  <h2 className="text-2xl font-extrabold text-slate-900">{activity.libelle}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {activity.jour ? `${activity.jour}` : "—"}{" "}
                    {activity.horaire ? `• ${activity.horaire}` : ""}{" "}
                    {activity.periode ? `• ${activity.periode}` : ""}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* icon circle */}
                  <div
                    className="flex items-center justify-center h-10 w-10 rounded-full
                              border border-slate-200 bg-white/80 text-[#205187]"
                    title={categorie}
                  >
                    <CategoryIcon className="text-xl" />
                  </div>

                  {/* visibility pill only for SUAPS */}
                  {isSuaps && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        isVisible
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {isVisible ? "Visible" : "Masquée"}
                    </span>
                  )}
                </div>

              </div>

              {categoryImg && (
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white/70">
                  <img
                    src={categoryImg}
                    alt={categorie}
                    className="h-96 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}


              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-500">Commentaire</div>
                  <div className="mt-1 font-extrabold text-slate-900">
                    {activity.commentaire ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="text-xs font-semibold text-slate-500">Lieu</div>
                  <div className="mt-1 font-extrabold text-slate-900">
                    {activity.lieu ?? activity.site?.nom ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="text-xs font-semibold text-slate-500">Statut</div>
                  <div className="mt-1 font-extrabold text-slate-900">{activity.statut ?? "—"}</div>
                </div>

                {isMoniteur && (
                  <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                    <div className="text-xs font-semibold text-slate-500">Quotas</div>
                    <div className="mt-1 font-semibold text-slate-900">
                      Étudiants: {activity.quota_etudiant ?? "—"} • Personnel: {activity.quota_personnel ?? "—"}
                    </div>
                  </div>
                )}
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
              <h3 className="text-base font-extrabold text-slate-900">Moniteurs</h3>

                {Array.isArray(activity.moniteurs) && activity.moniteurs.length > 0 ? (
                  <ul className="mt-2 text-sm text-slate-600 space-y-1">
                    {activity.moniteurs.map((m) => (
                      <li key={m.id}>
                        {`${m.user?.prenom ?? ""} ${m.user?.nom ?? ""}`.trim()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">—</p>
                )}

              {(isMoniteur || isSuaps) && (
                <>
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
                </>
              )}


              {canRegister && isOuverte && (
                <>
                  <div className="mt-6 h-px bg-slate-200" />
                  <button
                    disabled={isQuotaFull}
                    onClick={() => navigate(`/activities/${id}/register`)}
                    className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-extrabold transition
                      ${isQuotaFull
                        ? "cursor-not-allowed bg-slate-200 text-slate-500"
                        : "bg-[#334155] text-white hover:bg-[#1e293b]"
                      }`}
                  >
                    {isQuotaFull ? "Quota atteint" : "S’inscrire à cette activité"}
                  </button>
                </>
              )}

              {canRegister && !isOuverte && (
                <p className="mt-6 text-sm font-semibold text-slate-600">
                  Inscriptions fermées pour cette activité.
                </p>
              )}


              {canSeePreinscrits && (
                <>
                  <div className="mt-6 h-px bg-slate-200" />
                  <button
                    onClick={() => navigate(`/activities/${id}/preinscrits`)}
                    className="mt-4 w-full rounded-xl bg-[#334155] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#1e293b]"
                  >
                    Voir les pré-inscrits
                  </button>
                </>
              )}
              {isSuaps && (
                <>
                  <div className="mt-4 h-px bg-slate-200" />
                  <button
                    onClick={() => navigate(`/activities/${id}/edit`)}
                    className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-200"
                  >
                    Modifier l’activité
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
