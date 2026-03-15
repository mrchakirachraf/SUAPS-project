import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function readAuth() {
  const token = localStorage.getItem("access_token");
  let payload = null;
  try {
    payload = JSON.parse(localStorage.getItem("user"));
  } catch {
    payload = null;
  }
  const u = payload?.user ?? null;
  const isSuaps = Boolean(u?.moniteur?.is_suaps);
  return { token, user: u, isSuaps };
}

export default function ActivityEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [{ token, isSuaps }] = useState(() => readAuth());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [activity, setActivity] = useState(null);

  // form state
  const [form, setForm] = useState({
    libelle: "",
    jour: "lundi",
    horaire: "",
    periode: "S1",
    lieu: "",
    commentaire: "",
    description_pre_inscription: "",

    type_activite: "évaluée",

    quota_etudiant: 0,
    quota_personnel: 0,

    date_limite_inscription_s1: "",
    date_limite_note_s1: "",
    date_limite_inscription_s2: "",
    date_limite_note_s2: "",

    statut: "ouverte",
    visible: true,

    categorie_id: "",
    site_id: "",
    type_evenement_id: "",
    moniteurs: [],
  });

  // OPTIONAL: load selects (categories, sites, types, moniteurs)
  const [categories, setCategories] = useState([]);
  const [sites, setSites] = useState([]);
  const [types, setTypes] = useState([]);
  const [moniteurs, setMoniteurs] = useState([]);

  const headers = useMemo(() => ({
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  useEffect(() => {
    if (!token || !isSuaps) {
      // Not allowed
      navigate("/activities");
      return;
    }

    const controller = new AbortController();

    async function loadAll() {
      try {
        setLoading(true);
        setErr("");

        const [actRes, catRes, siteRes, typeRes, monRes] = await Promise.all([
          fetch(`${API}/api/activites/manage/${id}`, { signal: controller.signal, headers }),
          fetch(`${API}/api/categories`, { signal: controller.signal, headers }),
          fetch(`${API}/api/sites`, { signal: controller.signal, headers }),
          fetch(`${API}/api/type-evenements`, { signal: controller.signal, headers }),
          fetch(`${API}/api/moniteurs`, { signal: controller.signal, headers }),
        ]);

        const actData = await actRes.json();
        const cats = await catRes.json();
        const sis = await siteRes.json();
        const tys = await typeRes.json();
        const mons = await monRes.json();

        if (!actRes.ok) throw new Error(actData?.message || "Impossible de charger l’activité.");

        setActivity(actData);

        setCategories(Array.isArray(cats) ? cats : cats.data ?? []);
        setSites(Array.isArray(sis) ? sis : sis.data ?? []);
        setTypes(Array.isArray(tys) ? tys : tys.data ?? []);
        setMoniteurs(Array.isArray(mons) ? mons : mons.data ?? []);

        // ✅ Prefill form from backend object
        setForm({
            libelle: actData.libelle ?? "",
            jour: actData.jour ?? "lundi",
            horaire: actData.horaire ?? "",
            periode: actData.periode ?? "S1",
            lieu: actData.lieu ?? "",
            commentaire: actData.commentaire ?? "",
            description_pre_inscription: actData.description_pre_inscription ?? "",

            quota_etudiant: actData.quota_etudiant ?? 0,
            quota_personnel: actData.quota_personnel ?? 0,

            // ✅ for <input type="date"> -> must be "YYYY-MM-DD" or ""
            date_limite_inscription_s1: actData.date_limite_inscription_s1 ?? "",
            date_limite_note_s1: actData.date_limite_note_s1 ?? "",
            date_limite_inscription_s2: actData.date_limite_inscription_s2 ?? "",
            date_limite_note_s2: actData.date_limite_note_s2 ?? "",

            statut: actData.statut ?? "ouverte",
            visible: Boolean(actData.visible),

            type_activite: actData.type_activite ?? "évaluée",

            categorie_id: actData.categorie_id ?? actData.categorie?.id ?? "",
            site_id: actData.site_id ?? actData.site?.id ?? "",
            type_evenement_id: actData.type_evenement_id ?? actData.typeEvenement?.id ?? "",
            moniteurs: actData.moniteurs ? actData.moniteurs.map(m => m.id) : [],
        });


      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Erreur réseau.");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
    return () => controller.abort();
  }, [API, id, token, isSuaps, navigate, headers]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      setErr("");

      // ✅ You must create the backend route/controller for update (step below)
      const res = await fetch(`${API}/api/activites/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Erreur lors de la modification.");

      navigate(`/activities/${id}`);
    } catch (e) {
      setErr(e.message || "Erreur réseau.");
    } finally {
      setSaving(false);
    }
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

  if (err)
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
                {err}
              </p>
            </div>
          </div>
        </main>
      );

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">Modifier l’activité</h1>
        <Link to={`/activities/${id}`} className="text-sm font-bold text-slate-600 hover:underline">
          ← Retour
        </Link>
      </div>

      <form onSubmit={onSubmit} className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-slate-600">Libellé</span>
            <input
              value={form.libelle}
              onChange={(e) => setField("libelle", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Jour</span>
            <select
                value={form.jour}
                onChange={(e) => setField("jour", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                required
            >
                {["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"].map((j) => (
                <option key={j} value={j}>{j}</option>
                ))}
            </select>
            </label>


          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Horaire</span>
            <input
              value={form.horaire}
              onChange={(e) => setField("horaire", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Période</span>
            <select
                value={form.periode}
                onChange={(e) => setField("periode", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                required
            >
                {["S1","S2","S1/S2"].map((p) => (
                <option key={p} value={p}>{p}</option>
                ))}
            </select>
          </label>


          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Lieu</span>
            <input
              value={form.lieu}
              onChange={(e) => setField("lieu", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-slate-600">Commentaire</span>
            <textarea
              value={form.commentaire}
              onChange={(e) => setField("commentaire", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              rows={3}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-slate-600">Description pré-inscription</span>
            <textarea
                value={form.description_pre_inscription}
                onChange={(e) => setField("description_pre_inscription", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                rows={4}
            />
          </label>


          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Type d’activité</span>
            <select
                value={form.type_activite}
                onChange={(e) => setField("type_activite", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                required
            >
                {["évaluée","competitif","non évaluée","évaluée/competitive"].map((t) => (
                <option key={t} value={t}>{t}</option>
                ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Statut</span>
            <select
                value={form.statut}
                onChange={(e) => setField("statut", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                required
            >
                <option value="ouverte">ouverte</option>
                <option value="fermee">fermee</option>
            </select>
          </label>


          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Quota étudiant</span>
            <input
              type="number"
              value={form.quota_etudiant}
              onChange={(e) => setField("quota_etudiant", Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              min={0}
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Quota personnel</span>
            <input
              type="number"
              value={form.quota_personnel}
              onChange={(e) => setField("quota_personnel", Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              min={0}
            />
          </label>

          {/* Select examples */}
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Catégorie</span>
            <select
              value={form.categorie_id}
              onChange={(e) => setField("categorie_id", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              required
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Site</span>
            <select
              value={form.site_id}
              onChange={(e) => setField("site_id", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              required
            >
              <option value="">—</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Type évènement</span>
            <select
              value={form.type_evenement_id}
              onChange={(e) => setField("type_evenement_id", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              required
            >
              <option value="">—</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>{t.libelle}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Moniteurs</span>

            <select
              multiple
              value={form.moniteurs}
              onChange={(e) =>
                setField(
                  "moniteurs",
                  Array.from(e.target.selectedOptions, (o) => Number(o.value))
                )
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            >
              {[...moniteurs]
                  .sort((a, b) => {
                    const nomA = a.user?.nom?.toLowerCase() || "";
                    const nomB = b.user?.nom?.toLowerCase() || "";

                    if (nomA === nomB) {
                      const prenomA = a.user?.prenom?.toLowerCase() || "";
                      const prenomB = b.user?.prenom?.toLowerCase() || "";
                      return prenomA.localeCompare(prenomB);
                    }

                    return nomA.localeCompare(nomB);
                  })
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.user?.nom} {m.user?.prenom}
                    </option>
                  ))}
            </select>

            <p className="mt-1 text-xs text-slate-500">
              Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs moniteurs.
            </p>
          </label>

          <label className="flex items-center gap-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => setField("visible", e.target.checked)}
            />
            <span className="text-sm font-semibold text-slate-700">Visible</span>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Date limite inscription S1</span>
            <input
                type="date"
                value={form.date_limite_inscription_s1}
                onChange={(e) => setField("date_limite_inscription_s1", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Date limite note S1</span>
            <input
                    type="date"
                value={form.date_limite_note_s1}
                onChange={(e) => setField("date_limite_note_s1", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Date limite inscription S2</span>
            <input
                type="date"
                value={form.date_limite_inscription_s2}
                onChange={(e) => setField("date_limite_inscription_s2", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">Date limite note S2</span>
            <input
                type="date"
                value={form.date_limite_note_s2}
                onChange={(e) => setField("date_limite_note_s2", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>


        </div>

        <button
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-[#334155] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#1e293b] disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </main>
  );
}
