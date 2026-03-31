import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export default function UsersAdmin() {
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const [form, setForm] = useState({
    username: "",
    nom: "",
    prenom: "",
    email: "",
    formation: "",
    num_carte_etud: "",
    secretariat_id: "",
  });

  const [openCreateMoniteurModal, setOpenCreateMoniteurModal] = useState(false);
  const [studentForMoniteur, setStudentForMoniteur] = useState(null);
  const [createMoniteurError, setCreateMoniteurError] = useState("");
  const [creatingMoniteur, setCreatingMoniteur] = useState(false);

  const [moniteurForm, setMoniteurForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setShowScrollTop(window.scrollY > 300);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

  async function loadCarteImage(userId) {
    try {
      const res = await fetch(`${API}/api/users/${userId}/carte-etudiant`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setImgPreview("");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImgPreview(url);
    } catch {
      setImgPreview("");
    }
  }


  const openDetails = async (u) => {
    setOpen(true);
    setSelectedUser(u);
    setDetailsError("");
    setDetailsLoading(true);
    setImgFile(null);
    setImgPreview("");
    loadCarteImage(u.id);


    try {
      const res = await fetch(`${API}/api/users/${u.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");

      const user = data.user;
      const etu = data.etudiant; // peut être null si pas etudiant

      setForm({
        username: user.username ?? "",
        nom: user.nom ?? "",
        prenom: user.prenom ?? "",
        email: user.email ?? "",
        formation: etu?.formation ?? "",
        num_carte_etud: etu?.num_carte_etud ?? "",
        secretariat_id: etu?.secretariat_id ? String(etu.secretariat_id) : "",
      });
    } catch (e) {
      setDetailsError(e.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    if (imgPreview?.startsWith("blob:")) URL.revokeObjectURL(imgPreview);
    setImgPreview("");
    setImgFile(null);

    setOpen(false);
    setSelectedUser(null);
    setDetailsError("");
    setDetailsLoading(false);
  };


  const [secretariats, setSecretariats] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/secretariats`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();
        if (res.ok) setSecretariats(Array.isArray(data) ? data : (data.secretariats ?? []));
      } catch (e) {
    console.error(e);
  }
    })();
  }, []);

  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");



  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const saveDetails = async () => {
    if (!selectedUser) return;

    try {
      const fd = new FormData();
      fd.append("username", form.username);
      fd.append("nom", form.nom);
      fd.append("prenom", form.prenom);
      fd.append("email", form.email);

      // etudiant
      fd.append("formation", form.formation || "");
      fd.append("num_carte_etud", form.num_carte_etud || "");
      fd.append("secretariat_id", form.secretariat_id || "");

      // image
      if (imgFile) fd.append("img_carte_etud", imgFile);

      // IMPORTANT pour Laravel PUT + multipart
      fd.append("_method", "PUT");

      const res = await fetch(`${API}/api/users/${selectedUser.id}`, {
        method: "POST", // ✅ POST + _method=PUT
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // ❌ surtout pas Content-Type ici (le navigateur le met)
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");

      setUsers((prev) =>
        prev.map((x) =>
          x.id === selectedUser.id
            ? { ...x, username: form.username, nom: form.nom, prenom: form.prenom, email: form.email }
            : x
        )
      );

      closeDetails();
    } catch (e) {
      alert(e.message);
    }
  };


  // 🔐 Protection frontend
  useEffect(() => {
    if (!user || user.type_compte !== "suaps") {
      navigate("/activities");
    }
  }, [user, navigate]);


  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur");
        setUsers(data.users);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

    async function handleChangeType(u, newType) {
  if (!window.confirm(`Confirmer le changement vers "${newType}" ?`)) return;

  try {


    const isCurrentlySuaps = u.type_compte === 'suaps';
    // 🔁 Choix de la route selon l'état ACTUEL
    // ✅ On utilise maintenant u.id (user_id) directement dans l'URL
    let url = null;

    if (newType === "suaps" && !isCurrentlySuaps) {
      url = `${API}/api/users/${u.id}/make-suaps`;
    }

    if (newType === "moniteur" && isCurrentlySuaps) {
      url = `${API}/api/users/${u.id}/make-moniteur`;
    }

    if (!url) return;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur");

    // 🔄 Mise à jour locale fiable
    setUsers(prev =>
      prev.map(user =>
        user.id === u.id
          ? {
              ...user,
              type_compte: newType, // Mise à jour du type_compte
              moniteur: {
                ...user.moniteur,
                is_suaps: newType === "suaps",
              },
            }
          : user
      )
    );
  } catch (e) {
    alert(e.message);
  }

  
}

const openCreateMoniteur = (u) => {
  if (!u) return;

  const newUsername = `${u.username}.etu.moniteur`;

  const email = u.email || "";
  let newEmail = "";

  const atIndex = email.indexOf("@");

  if (atIndex !== -1) {
    const before = email.slice(0, atIndex);
    const after = email.slice(atIndex); // includes "@"
    newEmail = `${before}.etu.moniteur${after}`;
  } else {
    // fallback if email is weird
    newEmail = `${u.username}.etu.moniteur@example.com`;
  }

  setOpen(false);

  setStudentForMoniteur(u);
  setCreateMoniteurError("");
  setMoniteurForm({
    username: newUsername,
    email: newEmail,
    password: "",
    password_confirmation: "",
  });

  setOpenCreateMoniteurModal(true);
};

  const closeCreateMoniteur = () => {
    setOpenCreateMoniteurModal(false);
    setStudentForMoniteur(null);
    setCreateMoniteurError("");
    setCreatingMoniteur(false);
    setMoniteurForm({
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
  };

  const submitCreateMoniteur = async () => {
    if (!studentForMoniteur) return;

    if (!moniteurForm.password || moniteurForm.password.length < 8) {
      setCreateMoniteurError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (moniteurForm.password !== moniteurForm.password_confirmation) {
      setCreateMoniteurError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setCreatingMoniteur(true);
      setCreateMoniteurError("");

      const res = await fetch(
        `${API}/api/users/${studentForMoniteur.id}/create-moniteur-from-etudiant`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: moniteurForm.username,
            email: moniteurForm.email,
            password: moniteurForm.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0]?.[0];
          throw new Error(firstError || data.message || "Erreur");
        }
        throw new Error(data.message || "Erreur");
      }

      setUsers((prev) => [...prev, data.user]);
      closeCreateMoniteur();
      alert("Compte moniteur créé avec succès.");
    } catch (e) {
      setCreateMoniteurError(e.message);
    } finally {
      setCreatingMoniteur(false);
    }
  };



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
  
  if (error)
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
              {error}
            </p>
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

    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#205187]">
            SUAPS • Université du Littoral Côte d’Opale
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Gestion des utilisateurs
          </h1>
        </div>

        <Link
          to="/activities"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
        >
          ← Retour aux activités
        </Link>
      </div>

      {/* States */}
      {loading && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur-md">
          Chargement...
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white/75 p-6 shadow-sm backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500">
                  <th className="px-3 py-2">Username</th>
                  <th className="px-3 py-2">Nom</th>
                  <th className="px-3 py-2">Prénom</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-500">
                      Aucun utilisateur
                    </td>
                  </tr>
                )}

                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2 font-semibold">{u.username}</td>
                    <td className="px-3 py-2">{u.nom}</td>
                    <td className="px-3 py-2">{u.prenom}</td>
                    <td className="px-3 py-2">{u.email}</td>

                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {u.type_compte}
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {/* ✅ bouton details (affiché surtout pour etudiant) */}
                                                {u.type_compte === "etudiant" ? (
                          <button
                            onClick={() => openDetails(u)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Voir détails
                          </button>
                        ) : null}

                        {/* ton select existant */}
                        {(u.type_compte === "moniteur" || u.type_compte === "suaps") ? (
                          <select
                            defaultValue={u.type_compte}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            onChange={(e) => handleChangeType(u, e.target.value)}
                          >
                            <option value="moniteur">Moniteur</option>
                            <option value="suaps">SUAPS</option>
                          </select>
                        ) : (null)}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    {/* ✅ Modal details */}
    {open && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={closeDetails}
      >
        {/* backdrop */}
        <div className="absolute inset-0 bg-slate-900/60" />

        {/* card */}
        <div
          className="relative w-[92vw] max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Détails étudiant
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Modifier les informations puis enregistrer.
              </p>
            </div>

            <button
              onClick={closeDetails}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              ✕
            </button>
          </div>

          {detailsLoading && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Chargement...
            </div>
          )}

          {detailsError && !detailsLoading && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {detailsError}
            </div>
          )}

          {!detailsLoading && !detailsError && (
            <div className="mt-5 grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => onChange("username", e.target.value)}
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Nom"
                  value={form.nom}
                  onChange={(e) => onChange("nom", e.target.value)}
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Prénom"
                  value={form.prenom}
                  onChange={(e) => onChange("prenom", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Formation"
                  value={form.formation}
                  onChange={(e) => onChange("formation", e.target.value)}
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Num carte étudiant"
                  value={form.num_carte_etud}
                  onChange={(e) => onChange("num_carte_etud", e.target.value)}
                />
              </div>

              <select
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={form.secretariat_id}
                onChange={(e) => onChange("secretariat_id", e.target.value)}
              >
                <option value="">Sélectionnez un secrétariat</option>

                {secretariats.map((s) => (
                  <option key={s.id} value={s.id}>
                    {`${s.nom} ${s.prenom} • ${s.email} • ${s.telephone}`}
                  </option>
                ))}
              </select>

              <div className="mt-2">
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Image carte étudiant
                </label>

                {/* Preview centered */}
                <div className="flex flex-col items-center gap-3">

                  {/* Image container — auto size from image */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 inline-flex items-center justify-center">
                    {imgPreview ? (
                      <img
                        src={imgPreview}
                        alt="Carte étudiant"
                        className="max-h-[280px] max-w-[420px] object-contain rounded-xl"
                      />
                    ) : (
                      <span className="px-16 py-10 text-xs text-slate-500">Aperçu</span>
                    )}
                  </div>

                  {/* Upload button */}
                  <input
                    id="img_carte_etud"
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setImgFile(f || null);
                      if (imgPreview?.startsWith("blob:")) URL.revokeObjectURL(imgPreview);
                      setImgPreview(f ? URL.createObjectURL(f) : "");
                    }}
                  />

                  <label
                    htmlFor="img_carte_etud"
                    className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#205187] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
                  >
                    Changer l’image
                  </label>

                  <p className="text-xs text-slate-500">JPG/PNG (≤ 4MB)</p>
                </div>

              </div>




              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  onClick={closeDetails}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>

                <button
                  onClick={() => openCreateMoniteur(selectedUser)}
                  className="rounded-xl bg-[#334155] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
                >
                  Créer moniteur
                </button>

                <button
                  onClick={saveDetails}
                  className="rounded-xl bg-[#205187] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {openCreateMoniteurModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    onClick={closeCreateMoniteur}
  >
    <div className="absolute inset-0 bg-slate-900/60" />

    <div
      className="relative w-[92vw] max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Créer un compte moniteur
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Un nouveau compte moniteur sera créé à partir de l’étudiant sélectionné.
          </p>
        </div>

        <button
          onClick={closeCreateMoniteur}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          ✕
        </button>
      </div>

      {studentForMoniteur && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p><span className="font-bold">Étudiant :</span> {studentForMoniteur.nom} {studentForMoniteur.prenom}</p>
          <p><span className="font-bold">Compte actuel :</span> {studentForMoniteur.username}</p>
        </div>
      )}

      {createMoniteurError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {createMoniteurError}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3">
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Username"
                value={moniteurForm.username}
                onChange={(e) =>
                  setMoniteurForm((p) => ({ ...p, username: e.target.value }))
                }
              />

              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Email"
                value={moniteurForm.email}
                onChange={(e) =>
                  setMoniteurForm((p) => ({ ...p, email: e.target.value }))
                }
              />

              <input
                type="password"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Mot de passe"
                value={moniteurForm.password}
                onChange={(e) =>
                  setMoniteurForm((p) => ({ ...p, password: e.target.value }))
                }
              />

              <input
                type="password"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Confirmer le mot de passe"
                value={moniteurForm.password_confirmation}
                onChange={(e) =>
                  setMoniteurForm((p) => ({
                    ...p,
                    password_confirmation: e.target.value,
                  }))
                }
              />

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  onClick={closeCreateMoniteur}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>

                <button
                  onClick={submitCreateMoniteur}
                  disabled={creatingMoniteur}
                  className="rounded-xl bg-[#205187] px-4 py-2 text-sm font-extrabold text-white hover:opacity-95 disabled:opacity-60"
                >
                  {creatingMoniteur ? "Création..." : "Créer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
  <Link
    to="/admin/users/new-moniteur"
    className="
      group fixed bottom-6 right-6 z-50
      flex items-center justify-center
      h-14 w-14
      rounded-full bg-[#334155] text-white shadow-lg
      transition-all duration-300 ease-out
      hover:w-60 hover:rounded-2xl hover:shadow-xl
      active:scale-95
      overflow-hidden
    "
    aria-label="Ajouter un moniteur"
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
        group-hover:ml-3 group-hover:max-w-[220px]
      "
    >
      Ajouter un moniteur
    </span>
  </Link>
    {showScrollTop && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 z-50 flex items-center justify-center
                  h-12 w-12 rounded-full bg-[#334155] text-white shadow-lg
                  hover:scale-110 hover:opacity-90 transition-all duration-200"
      >
        ↑
      </button>
    )}
    
  </main>
);

}