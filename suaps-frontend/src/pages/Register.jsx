import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


// ✅ Correct input component (no crash)
function FormInput({ label, className = "", ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-100">
        {label}
      </label>
      <input
        {...props}
        className={
          "w-full rounded-xl border border-white/15 bg-white/90 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#E33A3B] focus:ring-4 focus:ring-[#E33A3B]/20 " +
          className
        }
      />
    </div>
  );
}


export default function Register() {
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    nom: "",
    prenom: "",
    fonction: "",
    email: "",
    password: "",
    confirmPassword: "",
    num_carte_etud: "",
    formation: "",
    nb_activites_inscrits: "",
    img_carte_etud: null,
  });

  const roles = [
    {
      id: "etudiant",
      name: "Étudiant",
      description: "Inscription aux activités, dépôt des documents, suivi des statuts.",
    },
    {
      id: "moniteur",
      name: "Moniteur",
      description: "Validation des inscriptions, suivi des groupes, évaluations.",
    },
    {
      id: "personnel",
      name: "Personnel",
      description: "Participer aux activités dans différents sites.",
    },
  ];

  const handleRoleSelect = (roleId) => setSelectedRole(roleId);

  const handleFormInputChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? (files?.[0] ?? null) : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedRole) return alert("Veuillez sélectionner un rôle.");
  if (formData.password !== formData.confirmPassword)
    return alert("Les mots de passe ne correspondent pas.");

  try {
    // ✅ base payload (common for all)
    const payload = {
      username: formData.username,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword, // ✅ Laravel confirmed rule
    };

    let url = "";

    if (selectedRole === "moniteur") {
      url = "http://localhost:8000/api/auth/register/moniteur";
    } else if (selectedRole === "etudiant") {
      url = "http://localhost:8000/api/auth/register/etudiant"; // to create later
    } else if (selectedRole === "personnel") {
      url = "http://localhost:8000/api/auth/register/personnel"; // to create later
    } else {
      return alert("Rôle non supporté.");
    }

    const res = await axios.post(url, payload);

    alert("Compte créé avec succès !");
    console.log(res.data);

    // Optionally redirect to login
    // navigate("/login");

  } catch (err) {
    console.error(err);

    // Laravel validation errors
    if (err.response?.status === 422) {
      const errors = err.response.data.errors;
      const firstMsg = Object.values(errors)?.[0]?.[0];
      alert(firstMsg || "Erreur de validation.");
      return;
    }

    alert("Erreur serveur. Réessayez.");
  }
};

  const roleLabel =
    selectedRole === "etudiant"
      ? "étudiant"
      : selectedRole === "moniteur"
      ? "moniteur"
      : selectedRole === "personnel"
      ? "personnel"
      : "";


  return (
    <main className="relative min-h-screen text-white">
      {/* ✅ Fixed background image */}
      <div className="fixed inset-0 -z-20 bg-black">
        <img
            src="/basketball-player-action-sunset 1.png"
            alt="Basketball Player Background"
            className="h-full w-full object-contain object-right"
        />
      </div>

      {/* ✅ Color overlay (blue->red gradient, soft) */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#205187]/80 via-black/70 to-[#E33A3B]/60" />

      {/* ✅ “Salt / soft layer” (grain-like / frosted look) */}
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        {/* subtle blobs */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              SUAPS • Université du Littoral Côte d’Opale
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Créer un compte
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              Accédez aux activités sportives, suivez vos inscriptions, et gérez
              les validations selon votre rôle.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-sm font-extrabold">Interface claire</div>
                <div className="mt-1 text-sm text-white/80">
                  Adaptée mobile & desktop, navigation simple.
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="text-sm font-extrabold">Gestion des inscriptions</div>
                <div className="mt-1 text-sm text-white/80">
                  Demandes, statuts, validations et suivi.
                </div>
              </div>
            </div>
          </div>

          {/* Role cards */}
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-sm backdrop-blur-md sm:p-6">
            <h2 className="text-base font-extrabold">Choisissez votre rôle</h2>
            <p className="mt-1 text-sm text-white/80">
              Cela adaptera les fonctionnalités après connexion.
            </p>

            <div className="mt-5 grid gap-3">
              {roles.map((role) => {
                const active = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`text-left rounded-2xl border p-4 transition ${
                      active
                        ? "border-[#E33A3B] border bg-[#E33A3B]/15"
                        : "border-white/15 border bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div
                          className={`text-sm font-extrabold ${
                            active ? "text-white" : "text-white"
                          }`}
                        >
                          {role.name}
                        </div>
                        <div className="mt-1 text-sm text-white/80">
                          {role.description}
                        </div>
                      </div>

                      {/* indicator */}
                      <div
                        className={`mt-1 h-5 w-5 rounded-full border-2 ${
                          active
                            ? "border-[#E33A3B] border bg-[#E33A3B]"
                            : "border-white/40 border bg-transparent"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="mt-10 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-sm backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-extrabold">
                Informations {roleLabel || "compte"}
              </h3>
              <p className="mt-1 text-sm text-white/80">
                Remplissez les informations ci-dessous. Les champs varient selon le rôle.
              </p>
            </div>

            <div className="text-sm">
              <span className="text-white/80">Déjà un compte ? </span>
              <Link to="/login" className="font-semibold text-white hover:underline">
                Se connecter
              </Link>
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-white/15" />

          {!selectedRole ? (
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
              Sélectionnez d’abord un rôle pour afficher le formulaire.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormInput
                  label="Nom d’utilisateur"
                  name="username"
                  value={formData.username}
                  onChange={handleFormInputChange}
                  placeholder="ex: bkhaider"
                  required
                />

                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormInputChange}
                  placeholder="ex: prenom.nom@univ-littoral.fr"
                  required
                />

                {selectedRole === "etudiant" ? (
                  <FormInput
                    label="Prénom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleFormInputChange}
                    placeholder="Votre prénom"
                    required
                  />
                ) : (
                  <FormInput
                    label="Fonction"
                    name="fonction"
                    value={formData.fonction}
                    onChange={handleFormInputChange}
                    placeholder="ex: Responsable, Assistant..."
                    required
                  />
                )}

                <FormInput
                  label="Nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleFormInputChange}
                  placeholder="Votre nom"
                  required
                />

                <FormInput
                  label="Mot de passe"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormInputChange}
                  placeholder="••••••••"
                  required
                />

                <FormInput
                  label="Confirmer le mot de passe"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleFormInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              {selectedRole === "etudiant" && (
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5">
                  <div className="text-sm font-extrabold">
                    Informations étudiant
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormInput
                      label="Numéro de carte étudiant"
                      name="num_carte_etud"
                      value={formData.num_carte_etud}
                      onChange={handleFormInputChange}
                      placeholder="ex: 12345678"
                    />

                    <FormInput
                      label="Formation"
                      name="formation"
                      value={formData.formation}
                      onChange={handleFormInputChange}
                      placeholder="ex: ING2, Licence, Master..."
                    />

                    <FormInput
                      label="Nombre d’activités inscrites"
                      type="number"
                      name="nb_activites_inscrits"
                      value={formData.nb_activites_inscrits}
                      onChange={handleFormInputChange}
                      placeholder="0"
                      min="0"
                    />

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-100">
                        Image carte étudiant (optionnel)
                      </label>
                      <FormInput
                        type="file"
                        name="img_carte_etud"
                        accept="image/*"
                        onChange={handleFormInputChange}
                        className="w-full rounded-xl border border-white/15 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none"
                      />
                      <p className="mt-2 text-xs text-white/70">
                        JPG/PNG recommandé (≤ 5MB).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/"
                  className="text-sm font-semibold text-white/80 hover:text-white hover:underline"
                >
                  Retour à l’accueil
                </Link>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-[#E33A3B] px-6 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-[#E33A3B]/25"
                >
                  S’inscrire
                </button>
              </div>

              <p className="text-xs text-white/60">
                En créant un compte, vous acceptez les règles d’utilisation de la plateforme SUAPS.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
