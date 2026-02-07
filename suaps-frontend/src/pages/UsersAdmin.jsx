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

  // 🔐 Protection frontend
  useEffect(() => {
  if (!user || !user.type_compte === "suaps") {
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
                      {(u.type_compte === "moniteur" || u.type_compte === "suaps") ? (
                        <select
                          defaultValue={u.type_compte}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          onChange={(e) =>
                            handleChangeType(u, e.target.value)
                          }
                        >
                          <option value="moniteur">Moniteur</option>
                          <option value="suaps">SUAPS</option>
                        </select>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </main>
);

}