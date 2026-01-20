import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";



function FormInput({ label, className = "", ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        {...props}
        className={
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#205187] focus:ring-4 focus:ring-[#205187]/15 " +
          className
        }
      />
    </div>
  );
}



export default function Register() {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const messageRef = useRef(null);


  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (errorMessage || successMessage) {
      messageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [errorMessage, successMessage]);


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

  setErrorMessage("");
  setSuccessMessage("");

  if (!selectedRole) {
    setErrorMessage("Veuillez sélectionner un rôle.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setErrorMessage("Les mots de passe ne correspondent pas.");
    return;
  }

  try {
    setIsSubmitting(true);

    let url = "";
    let payload;

    if (selectedRole === "etudiant") {
      url = "http://localhost:8000/api/auth/register/etudiant";

      payload = new FormData();
      payload.append("username", formData.username);
      payload.append("nom", formData.nom);
      payload.append("prenom", formData.prenom);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("password_confirmation", formData.confirmPassword);
      payload.append("num_carte_etud", formData.num_carte_etud);
      payload.append("formation", formData.formation);

      if (formData.img_carte_etud) {
        payload.append("img_carte_etud", formData.img_carte_etud);
      }

    } else if (selectedRole === "moniteur") {
      url = "http://localhost:8000/api/auth/register/moniteur";

      payload = {
        username: formData.username,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };

    } else if (selectedRole === "personnel") {
      url = "http://localhost:8000/api/auth/register/personnel";

      payload = {
        username: formData.username,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };
    }

    await axios.post(url, payload, {
      headers:
        payload instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
    });

    setSuccessMessage("Compte créé avec succès. Redirection en cours...");

    // ⏳ petite pause UX
    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (err) {
    console.error(err);

    if (err.response?.status === 422) {
      const errors = err.response.data.errors;
      const firstMsg = Object.values(errors)?.[0]?.[0];
      setErrorMessage(firstMsg || "Erreur de validation.");
      return;
    }

    setErrorMessage("Une erreur serveur est survenue. Veuillez réessayer.");
  } finally {
    setIsSubmitting(false);
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
    <main className="relative min-h-screen text-slate-900">
      {/* ✅ Fixed background image */}
      <div className="fixed inset-0 -z-20 bg-white">
        <img
            src="/basketball-player-action-sunset 1.png"
            alt="Basketball Player Background"
            className="h-full w-full object-contain object-right opacity-85"
        />
      </div>

      {/* ✅ Color overlay (blue->red gradient, soft) */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#205187]/12 via-white/65 to-[#334155]/12" />

      {/* ✅ “Salt / soft layer” (grain-like / frosted look) */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#205187]/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#334155]/10 blur-3xl" />
      </div>


      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#205187]">
              SUAPS • Université du Littoral Côte d’Opale
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Créer un compte
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-900 sm:text-base">
              Accédez aux activités sportives, suivez vos inscriptions, et gérez
              les validations selon votre rôle.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-md">
                <div className="text-sm font-extrabold text-slate-900">Interface claire</div>
                <div className="mt-1 text-sm text-slate-600">
                  Adaptée mobile & desktop, navigation simple.
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur-md">
                <div className="text-sm font-extrabold text-slate-900">Gestion des inscriptions</div>
                <div className="mt-1 text-sm text-slate-600">
                  Demandes, statuts, validations et suivi.
                </div>
              </div>
            </div>
          </div>

          {/* Role cards */}
          <div className="rounded-3xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur-md sm:p-6">
            <h2 className="text-base font-extrabold text-slate-900">Choisissez votre rôle</h2>
            <p className="mt-1 text-sm text-slate-900">
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
                        ? "border-[#334155] border bg-[#334155]/10"
                        : "border-slate-200 border bg-white/60 hover:bg-white/80"

                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className={`text-sm font-extrabold ${active ? "text-[#334155]" : "text-slate-900"}`}>
                          {role.name}
                        </div>

                        <div className="mt-1 text-sm text-slate-600">
                          {role.description}
                        </div>
                      </div>

                      {/* indicator */}
                      <div
                        className={`mt-1 h-5 w-5 rounded-full border-2 ${
                          active
                            ? "border-[#334155] border bg-[#334155]"
                            : "border-slate-300 border bg-white"

                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div ref={messageRef}>
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}
        </div>



        {/* Form card */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-extrabold">
                Informations {roleLabel || "compte"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Remplissez les informations ci-dessous. Les champs varient selon le rôle.
              </p>
            </div>

            <div className="text-sm">
              <span className="text-slate-600">Déjà un compte ? </span>
              <Link to="/login" className="font-semibold text-[#205187] hover:underline">
                Se connecter
              </Link>
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-slate-200" />

          {!selectedRole ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white/60 p-4 text-sm text-slate-600">
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

                
                 <FormInput
                  label="Prénom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleFormInputChange}
                  placeholder="Votre prénom"
                  required
                />



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
                <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 sm:p-5">
                  

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

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Image carte étudiant
                      </label>
                      <FormInput
                        type="file"
                        name="img_carte_etud"
                        accept="image/*"
                        onChange={handleFormInputChange}
                        className="w-full rounded-xl border border-white/15 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none"
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        JPG/PNG recommandé (≤ 5MB).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/" className="text-sm font-semibold text-[#205187] hover:underline">
                  Retour à l’accueil
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center rounded-xl bg-[#334155] px-6 py-3 text-sm font-extrabold text-white shadow-sm transition
                    ${isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:opacity-95"}
                  `}
                >
                  {isSubmitting ? "Création en cours..." : "S’inscrire"}
                </button>

              </div>

              <p className="text-xs text-slate-500">
                En créant un compte, vous acceptez les règles d’utilisation de la plateforme SUAPS.
              </p>

            </form>
          )}
        </div>
      </div>
    </main>
  );
}
