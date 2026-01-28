import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

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
        <button className="rounded-xl bg-[#334155] px-4 py-2 text-sm font-extrabold text-white hover:bg-[#1e293b]">
          Voir détails
        </button>
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

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setErr("");

        // If your API is protected, add token:
        const token = localStorage.getItem("access_token");

        const res = await fetch(`${API}/api/activites`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Impossible de charger les activités.");

        setItems(Array.isArray(data) ? data : data.data ?? []);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Erreur réseau.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const optionSets = useMemo(() => {
    const uniq = (arr) => Array.from(new Set(arr.filter(Boolean))).sort();
    const cat = uniq(items.map((a) => a.categorie?.nom));
    const si = uniq(items.map((a) => a.site?.nom));
    const j = uniq(items.map((a) => a.jour));
    const p = uniq(items.map((a) => a.periode));
    const t = uniq(items.map((a) => a.type_evenement?.libelle ?? a.typeEvenement?.libelle));
    const s = uniq(items.map((a) => a.statut));
    return { cat, si, j, p, t, s };
  }, [items]);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();

    return items.filter((a) => {
      const okQ =
        !qLower ||
        (a.libelle ?? "").toLowerCase().includes(qLower) ||
        (a.lieu ?? "").toLowerCase().includes(qLower) ||
        (a.categorie?.nom ?? "").toLowerCase().includes(qLower) ||
        (a.site?.nom ?? "").toLowerCase().includes(qLower);

      const okCat = !categorie || a.categorie?.nom === categorie;
      const okSite = !site || a.site?.nom === site;
      const okJour = !jour || a.jour === jour;
      const okPeriode = !periode || a.periode === periode;
      const aType = a.type_evenement?.libelle ?? a.typeEvenement?.libelle;
      const okType = !type || aType === type;
      const okStatut = !statut || a.statut === statut;

      return okQ && okCat && okSite && okJour && okPeriode && okType && okStatut;
    });
  }, [items, q, categorie, site, jour, periode, type, statut]);

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
            Total : <span className="font-extrabold text-slate-900">{filtered.length}</span>
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
              options={[{ value: "", label: "Toutes" }, ...optionSets.cat.map((x) => ({ value: x, label: x }))]}
            />
            <Select
              label="Site"
              value={site}
              onChange={setSite}
              options={[{ value: "", label: "Tous" }, ...optionSets.si.map((x) => ({ value: x, label: x }))]}
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
              options={[{ value: "", label: "Tous" }, ...optionSets.t.map((x) => ({ value: x, label: x }))]}
            />
            <Select
              label="Statut"
              value={statut}
              onChange={setStatut}
              options={[{ value: "", label: "Tous" }, ...optionSets.s.map((x) => ({ value: x, label: x }))]}
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
            {filtered.map((a) => (
              <ActivityCard key={a.id} a={a} />
            ))}
            {filtered.length === 0 && (
              <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur-md">
                Aucune activité ne correspond à vos filtres.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
