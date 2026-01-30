import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

const DAYS_ORDER = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
const STATUTS_ORDER = ["ouverte","fermee"];
const PERIODES_ORDER = ["S1","S2"];
const TYPES_ACTIVITE = [
  "évaluée",
  "competitif",
  "non évaluée",
  "évaluée/competitive",
];




function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#205187] focus:ring-4 focus:ring-[#205187]/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR");
}

function ActivityCard({ a }) {
  const categorie = a.categorie?.nom ?? "—";
  const site = a.site?.nom ?? "—";
  const type = a.type_evenement?.libelle ?? a.typeEvenement?.libelle ?? "—";

  const visible = a.visible === 1 || a.visible === true;
  const statut = a.statut ?? "—";

  const typeActivite = a.type_activite ?? "—";


  return (
    <article className="rounded-3xl border border-slate-200 bg-white/75 p-5 shadow-sm backdrop-blur-md transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">{a.libelle}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {a.jour ? `${a.jour}` : ""} {a.horaire ? `• ${a.horaire}` : ""}{" "}
            {a.periode ? `• ${a.periode}` : ""}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge>{categorie}</Badge>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
              visible ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {visible ? "Visible" : "Masquée"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-3">
          <div className="text-xs font-semibold text-slate-500">Lieu</div>
          <div className="mt-1 font-semibold text-slate-900">{a.lieu ?? site}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 p-3">
          <div className="text-xs font-semibold text-slate-500">Type</div>
          <div className="mt-1 font-semibold text-slate-900">{type}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 p-3">
          <div className="text-xs font-semibold text-slate-500">Type d’activité</div>
          <div className="mt-1 font-semibold text-slate-900">
            {typeActivite}
          </div>
        </div>


        <div className="rounded-2xl border border-slate-200 bg-white/70 p-3">
          <div className="text-xs font-semibold text-slate-500">Quota</div>
          <div className="mt-1 font-semibold text-slate-900">
            Étudiants: {a.quota_etudiant ?? "—"} • Pers.: {a.quota_personnel ?? "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 p-3">
          <div className="text-xs font-semibold text-slate-500">Statut</div>
          <div className="mt-1 font-semibold text-slate-900">{statut}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>Inscr. S1: {formatDate(a.date_limite_inscription_s1)}</Badge>
        <Badge>Notes S1: {formatDate(a.date_limite_note_s1)}</Badge>
        <Badge>Inscr. S2: {formatDate(a.date_limite_inscription_s2)}</Badge>
        <Badge>Notes S2: {formatDate(a.date_limite_note_s2)}</Badge>
      </div>

      <div className="mt-5 flex items-center justify-end">
        <div className="mt-5 flex items-center justify-end">
          <Link
            to={`/activities/${a.id}`}
            className="rounded-xl bg-[#334155] px-4 py-2 text-sm font-extrabold text-white hover:bg-[#1e293b]"
          >
            Voir détails
          </Link>
        </div>

      </div>
    </article>
  );
}

export default function ActivitiesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [categorie, setCategorie] = useState("");
  const [site, setSite] = useState("");
  const [jour, setJour] = useState("");
  const [periode, setPeriode] = useState("");
  const [type, setType] = useState("");
  const [statut, setStatut] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [categories, setCategories] = useState([]);
  const [sites, setSites] = useState([]);
  const [types, setTypes] = useState([]);
  const [perPage, setPerPage] = useState(10);

  const [canAddActivity, setCanAddActivity] = useState(false);

  const [typeActivite, setTypeActivite] = useState("");





  useEffect(() => {
    const controller = new AbortController();

    async function loadAll() {
      try {
        setLoading(true);
        setErr("");

        const token = localStorage.getItem("access_token");
        const headers = {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // ✅ Build query params for backend filtering + pagination
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("per_page", String(perPage));

        if (q.trim()) params.set("search", q.trim());
        if (categorie) params.set("categorie", categorie);
        if (site) params.set("site", site);
        if (jour) params.set("jour", jour);
        if (periode) params.set("periode", periode);
        if (type) params.set("type", type);
        if (statut) params.set("statut", statut);
        if (typeActivite) params.set("type_activite", typeActivite);


        const actUrl = `${API}/api/activites?${params.toString()}`;

        const [actRes, catRes, siteRes, typeRes] = await Promise.all([
          fetch(actUrl, { signal: controller.signal, headers }),
          fetch(`${API}/api/categories`, { signal: controller.signal, headers }),
          fetch(`${API}/api/sites`, { signal: controller.signal, headers }),
          fetch(`${API}/api/type-evenements`, { signal: controller.signal, headers }),
        ]);

        const acts = await actRes.json();
        const cats = await catRes.json();
        const sis = await siteRes.json();
        const tys = await typeRes.json();

        if (!actRes.ok) throw new Error(acts?.message || "Impossible de charger les activités.");
        if (!catRes.ok) throw new Error(cats?.message || "Impossible de charger les catégories.");
        if (!siteRes.ok) throw new Error(sis?.message || "Impossible de charger les sites.");
        if (!typeRes.ok) throw new Error(tys?.message || "Impossible de charger les types.");

        // ✅ Laravel paginate() returns { data, current_page, last_page, total, ... }
        const activities = acts?.data ?? [];
        setItems(activities);
        setLastPage(acts?.last_page ?? 1);
        setTotal(acts?.total ?? activities.length);

        setCategories(Array.isArray(cats) ? cats : cats.data ?? []);
        setSites(Array.isArray(sis) ? sis : sis.data ?? []);
        setTypes(Array.isArray(tys) ? tys : tys.data ?? []);

      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Erreur réseau.");
      } finally {
        setLoading(false);
      }
    }


    loadAll();
    return () => controller.abort();
  }, [page, perPage, q, categorie, site, jour, periode, type, typeActivite, statut]);


  useEffect(() => {
      setPage(1);
    }, [q, categorie, site, jour, periode, type, typeActivite, statut, perPage]);

    const optionSets = useMemo(() => {
      return {
        j: DAYS_ORDER,
        p: PERIODES_ORDER,
        s: STATUTS_ORDER,
      };
    }, []);

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("auth:changed", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("auth:changed", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);


  useEffect(() => {
    async function checkPermission() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return setCanAddActivity(false);

        const res = await fetch(`${API}/api/moniteurs/me`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("moniteurs/me status:", res.status);
        console.log("moniteurs/me data:", data);

        if (!res.ok) return setCanAddActivity(false);

        setCanAddActivity(Boolean(data.is_moniteur && data.is_suaps));
      } catch (e) {
        console.error("Error checking permission:", e);
        setCanAddActivity(false);
      }
    }

    checkPermission();
  }, []);




  // console.log("user:", user);
 
  // console.log(JSON.parse(localStorage.getItem("user")));

  

  return (
    <main className="relative min-h-screen text-slate-900">
      {/* Background (same template vibe) */}
      <div className="fixed inset-0 -z-20 bg-white" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#205187]/10 via-white/75 to-[#334155]/10" />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#205187]/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#334155]/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#205187]">
              SUAPS • Université du Littoral Côte d’Opale
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Liste des activités
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Recherchez et filtrez les activités sportives disponibles.
            </p>
          </div>

          <div className="text-sm text-slate-600">
            Total : <span className="font-extrabold text-slate-900">{total}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-md sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="block md:col-span-2 lg:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Recherche</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ex: Basket, Lieu, Catégorie..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#205187] focus:ring-4 focus:ring-[#205187]/10"
              />
            </label>

            <Select
              label="Catégorie"
              value={categorie}
              onChange={setCategorie}
              options={[
                { value: "", label: "Toutes" },
                ...categories.map((c) => ({ value: c.nom, label: c.nom })),
              ]}
            />
            <Select
              label="Site"
              value={site}
              onChange={setSite}
              options={[
                { value: "", label: "Tous" },
                ...sites.map((s) => ({ value: s.nom, label: s.nom })),
              ]}
            />
            <Select
              label="Jour"
              value={jour}
              onChange={setJour}
              options={[{ value: "", label: "Tous" }, ...optionSets.j.map((x) => ({ value: x, label: x }))]}
            />
            <Select
              label="Période"
              value={periode}
              onChange={setPeriode}
              options={[{ value: "", label: "Toutes" }, ...optionSets.p.map((x) => ({ value: x, label: x }))]}
            />
            <Select
              label="Type"
              value={type}
              onChange={setType}
              options={[
                { value: "", label: "Tous" },
                ...types.map((t) => ({ value: t.libelle, label: t.libelle })),
              ]}
            />

            <Select
              label="Type d’activité"
              value={typeActivite}
              onChange={setTypeActivite}
              options={[
                { value: "", label: "Tous" },
                ...TYPES_ACTIVITE.map((t) => ({ value: t, label: t })),
              ]}
            />

            <Select
              label="Statut"
              value={statut}
              onChange={setStatut}
              options={[{ value: "", label: "Tous" }, ...optionSets.s.map((x) => ({ value: x, label: x }))]}
            />

            <Select
              label="Par page"
              value={String(perPage)}
              onChange={(v) => setPerPage(Number(v))}
              options={[
                { value: "5", label: "5" },
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "50", label: "50" },
              ]}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setQ("");
                setCategorie("");
                setSite("");
                setJour("");
                setPeriode("");
                setType("");
                setStatut("");
                setTypeActivite("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Réinitialiser
            </button>

            <span className="text-xs text-slate-500">
              Astuce : utilisez la recherche + filtres pour trouver rapidement.
            </span>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur-md">
            Chargement des activités...
          </div>
        )}

        {err && !loading && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {err}
          </div>
        )}

        {/* List */}
        {!loading && !err && (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {items.map((a) => (
              <ActivityCard key={a.id} a={a} />
            ))}
            {items.length === 0 && (
              <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur-md">
                Aucune activité ne correspond à vos filtres.
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-md">
  <div className="text-sm text-slate-600">
    Page <span className="font-extrabold text-slate-900">{page}</span> /{" "}
    <span className="font-extrabold text-slate-900">{lastPage}</span>{" "}
    <span className="ml-2">• Total : <span className="font-extrabold text-slate-900">{total}</span></span>
  </div>

  <div className="flex items-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        ← Précédent
      </button>

      <button
        disabled={page >= lastPage}
        onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
        className="rounded-xl bg-[#334155] px-4 py-2 text-sm font-extrabold text-white hover:bg-[#1e293b] disabled:opacity-50"
      >
        Suivant →
      </button>
    </div>
</div>

      </div>
          {/* ✅ Floating Add Activity button (only for moniteur SUAPS) */}
      
      {canAddActivity && (
        <Link
          to="/activities/new"
          className="
            group fixed bottom-6 right-6 z-50
            flex items-center justify-center
            h-14 w-14
            rounded-full bg-[#334155] text-white shadow-lg
            transition-all duration-300 ease-out
            hover:w-56 hover:rounded-2xl hover:shadow-xl
            active:scale-95
            overflow-hidden
          "
          aria-label="Ajouter une activité"
        >
          {/* PLUS */}
          <span
            className="
              flex items-center justify-center
              text-3xl font-black
              leading-none
              select-none
            "
          >
            +
          </span>

          {/* TEXT */}
          <span
            className="
              ml-0 max-w-0 overflow-hidden whitespace-nowrap
              text-sm font-extrabold
              transition-all duration-300
              group-hover:ml-3 group-hover:max-w-[200px]
            "
          >
            Ajouter une activité
          </span>
        </Link>
      )}






      
    </main>
  );
}
