import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export default function CreateActivity() {
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const emptyForm = {
    libelle: "",
    horaire: "",
    lieu: "",
    commentaire: "",
    description_pre_inscription: "",
    periode: "S1",
    jour: "lundi",
    type_activite: "non évaluée",
    quota_etudiant: "",
    quota_personnel: "",
    date_limite_inscription_s1: "",
    date_limite_note_s1: "",
    date_limite_inscription_s2: "",
    date_limite_note_s2: "",
    statut: "ouverte",
    visible: true,
    categorie_id: "",
    site_id: "",
    type_evenement_id: "",
    moniteur_id: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [isInvalid, setIsInvalid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [categories, setCategories] = useState([]);
  const [sites, setSites] = useState([]);
  const [typesEvenements, setTypesEvenements] = useState([]);
  const [moniteurs, setMoniteurs] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/categories`).then(r => r.json()),
      fetch(`${API}/api/sites`).then(r => r.json()),
      fetch(`${API}/api/type-evenements`).then(r => r.json()),
      fetch(`${API}/api/moniteurs`).then(r => r.json()),
    ]).then(([cats, sites, types, mons]) => {
      setCategories(cats);
      setSites(sites);
      setTypesEvenements(types);
      setMoniteurs(mons);
    });
  }, []);


  // 🔐 Protection SUAPS
  useEffect(() => {
    if (!user || user.type_compte !== "suaps") {
      navigate("/activities");
    }
  }, [user, navigate]);

  // Vérifie si tous les champs obligatoires sont remplis
  useEffect(() => {
    const requiredFilled =
      form.libelle &&
      form.periode &&
      form.jour &&
      form.type_activite &&
      form.quota_etudiant &&
      form.quota_personnel &&
      form.categorie_id &&
      form.site_id &&
      form.type_evenement_id &&
      form.moniteur_id;
    setIsInvalid(!requiredFilled);
  }, [form]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/activites`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la création");

      alert("Activité créée avec succès !");
      setForm(emptyForm);
      navigate("/activities"); // Redirection vers la liste
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(emptyForm);
  }

  // Rend les champs de dates visibles selon la période choisie
  const showS1 = form.periode === "S1" || form.periode === "S1/S2";
  const showS2 = form.periode === "S2" || form.periode === "S1/S2";

  if (error)
    return (
      <main className="relative min-h-screen text-slate-900">
        <div className="fixed inset-0 -z-20 bg-white" />
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#205187]/10 via-white/75 to-[#334155]/10" />
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#205187]/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#334155]/10 blur-3xl" />
        </div>

        <div className="mt-6">
          <Link
            to="/activities/manage"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            ← Retour à la liste
          </Link>
        </div>

        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="flex flex-col justify-center items-center w-full max-w-md rounded-3xl border border-red-200 bg-red-50/80 p-8 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-extrabold text-red-700">Erreur</h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>
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
              Ajouter une activité
            </h1>
          </div>
          <Link
            to="/activities/manage"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            ← Retour à la liste
          </Link>
        </div>

        {/* Form */}
        <form
          onSubmit={submit}
          className="mt-8 grid gap-4 rounded-3xl border bg-white/70 p-6 backdrop-blur"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Libelle */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Libellé *</label>
              <input
                placeholder="Libellé"
                value={form.libelle}
                required
                onChange={(e) => setForm({ ...form, libelle: e.target.value })}
                className="rounded-xl border px-3 py-2"
              />
            </div>

            {/* Horaire */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Horaire *</label>
              <input
                placeholder="Horaire"
                value={form.horaire}
                onChange={(e) => setForm({ ...form, horaire: e.target.value })}
                className="rounded-xl border px-3 py-2"
              />
            </div>

            {/* Lieu */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Lieu</label>
              <input
                placeholder="Lieu"
                value={form.lieu}
                onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                className="rounded-xl border px-3 py-2"
              />
            </div>

            {/* Site */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Site *</label>
              <select
                required
                value={form.site_id}
                onChange={(e) =>
                  setForm({ ...form, site_id: e.target.value })
                }
                className="rounded-xl border px-3 py-2"
              >
                <option value="">-- Choisir --</option>
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.nom}</option>
                ))}
              </select>
            </div>


            {/* Periode */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Période *</label>
              <select
                value={form.periode}
                onChange={(e) => setForm({ ...form, periode: e.target.value })}
                className="rounded-xl border px-3 py-2"
                required
              >
                <option value="">-- Choisir --</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S1/S2">S1/S2</option>
              </select>
            </div>

            {/* Jour */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Jour *</label>
              <select
                value={form.jour}
                onChange={(e) => setForm({ ...form, jour: e.target.value })}
                className="rounded-xl border px-3 py-2"
                required
              >
                <option value="">-- Choisir --</option>
                <option value="lundi">Lundi</option>
                <option value="mardi">Mardi</option>
                <option value="mercredi">Mercredi</option>
                <option value="jeudi">Jeudi</option>
                <option value="vendredi">Vendredi</option>
                <option value="samedi">Samedi</option>
                <option value="dimanche">Dimanche</option>
              </select>
            </div>

            {/* categorie */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Catégorie *</label>
              <select
                required
                value={form.categorie_id}
                onChange={(e) =>
                  setForm({ ...form, categorie_id: e.target.value })
                }
                className="rounded-xl border px-3 py-2"
              >
                <option value="">-- Choisir --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.libelle}</option>
                ))}
              </select>
            </div>

            {/* type evenement */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Type d'événement *</label>
              <select
                required
                value={form.type_evenement_id}
                onChange={(e) =>
                  setForm({ ...form, type_evenement_id: e.target.value })
                }
                className="rounded-xl border px-3 py-2"
              >
                <option value="">-- Choisir --</option>
                {typesEvenements.map(t => (
                  <option key={t.id} value={t.id}>{t.libelle}</option>
                ))}
              </select>
            </div>

            {/* Type activité */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Type d'activité *</label>
              <select
                value={form.type_activite}
                onChange={(e) =>
                  setForm({ ...form, type_activite: e.target.value })
                }
                className="rounded-xl border px-3 py-2"
                required
              >
                <option value="">-- Choisir --</option>
                <option value="non évaluée">Non évaluée</option>
                <option value="évaluée">Évaluée</option>
                <option value="competitif">Compétitif</option>
                <option value="évaluée/competitive">Évaluée/Compétitive</option>
              </select>
            </div>
            {/* Moniteur */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Moniteur *</label>
              <select
                required
                value={form.moniteur_id}
                onChange={(e) =>
                  setForm({ ...form, moniteur_id: e.target.value })
                }
                className="rounded-xl border px-3 py-2"
              >
                <option value="">-- Choisir --</option>
                {moniteurs.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.user?.nom} {m.user?.prenom}
                  </option>
                ))}
              </select>
            </div>

            {/* Quotas */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Quota étudiants *</label>
              <input
                type="number"
                value={form.quota_etudiant}
                required
                onChange={(e) =>
                  setForm({ ...form, quota_etudiant: e.target.value })
                }
                className="rounded-xl border px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Quota personnel *</label>
              <input
                type="number"
                value={form.quota_personnel}
                required
                onChange={(e) =>
                  setForm({ ...form, quota_personnel: e.target.value })
                }
                className="rounded-xl border px-3 py-2"
              />
            </div>

            {/* Commentaire */}
            <div className="flex flex-col col-span-2">
              <label className="font-semibold text-slate-700">Commentaire</label>
              <textarea
                value={form.commentaire}
                onChange={(e) =>
                  setForm({ ...form, commentaire: e.target.value })
                }
                className="rounded-xl border px-3 py-2"
                rows={3}
              />
            </div>

            {/* Description pré-inscription */}
            <div className="flex flex-col col-span-2">
              <label className="font-semibold text-slate-700">Description pré-inscription</label>
              <textarea
                value={form.description_pre_inscription}
                onChange={(e) =>
                  setForm({ ...form, description_pre_inscription: e.target.value })
                }
                className="rounded-xl border px-3 py-2"
                rows={3}
              />
            </div>

            


            {/* Dates limites */}
            {showS1 && (
              <>
                <div className="flex flex-col">
                  <label className="font-semibold text-slate-700">Date limite inscription S1</label>
                  <input
                    type="date"
                    value={form.date_limite_inscription_s1}
                    onChange={(e) =>
                      setForm({ ...form, date_limite_inscription_s1: e.target.value })
                    }
                    className="rounded-xl border px-3 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-slate-700">Date limite note S1</label>
                  <input
                    type="date"
                    value={form.date_limite_note_s1}
                    onChange={(e) =>
                      setForm({ ...form, date_limite_note_s1: e.target.value })
                    }
                    className="rounded-xl border px-3 py-2"
                  />
                </div>
              </>
            )}

            {showS2 && (
              <>
                <div className="flex flex-col">
                  <label className="font-semibold text-slate-700">Date limite inscription S2</label>
                  <input
                    type="date"
                    value={form.date_limite_inscription_s2}
                    onChange={(e) =>
                      setForm({ ...form, date_limite_inscription_s2: e.target.value })
                    }
                    className="rounded-xl border px-3 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-slate-700">Date limite note S2</label>
                  <input
                    type="date"
                    value={form.date_limite_note_s2}
                    onChange={(e) =>
                      setForm({ ...form, date_limite_note_s2: e.target.value })
                    }
                    className="rounded-xl border px-3 py-2"
                  />
                </div>
              </>
            )}

            {/* Statut */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Statut</label>
              <select
                value={form.statut}
                onChange={(e) => setForm({ ...form, statut: e.target.value })}
                className="rounded-xl border px-3 py-2"
              >
                <option value="">-- Choisir --</option>
                <option value="ouverte">Ouverte</option>
                <option value="fermee">Fermée</option>
              </select>
            </div>

            {/* Visible */}
            <div className="flex flex-col">
              <label className="font-semibold text-slate-700">Visibilité</label>
              <select
                value={form.visible}
                onChange={(e) => setForm({ ...form, visible: e.target.value === "true" })}
                className="rounded-xl border px-3 py-2"
              >
                <option value="">-- Choisir --</option>
                <option value={true}>Visible</option>
                <option value={false}>Masquée</option>
              </select>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-row-reverse gap-3 mt-4">
            <button
              type="submit"
              disabled={isInvalid || loading}
              className={`rounded-xl px-6 py-2 font-extrabold text-white ${
                isInvalid || loading
                  ? "cursor-not-allowed bg-slate-300"
                  : "bg-[#334155] hover:bg-[#1e293b]"
              }`}
            >
              {loading ? "Création..." : "Créer l'activité"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 bg-white px-6 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
