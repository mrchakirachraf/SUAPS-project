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



  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/activities" className="text-sm font-extrabold text-[#205187]">
        ← Retour
      </Link>

      <h1 className="mb-6 text-3xl font-extrabold">
        Gestion des utilisateurs
      </h1>

      <table className="w-full border-collapse border border-slate-300 text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="border px-2 py-1">Username</th>
            <th className="border px-2 py-1">Nom</th>
            <th className="border px-2 py-1">Prénom</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-2">
                Aucun utilisateur
              </td>
            </tr>
          )}

          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.username}</td>
              <td className="border px-2 py-1">{u.nom}</td>
              <td className="border px-2 py-1">{u.prenom}</td>
              <td className="border px-2 py-1">{u.email}</td>

              <td className="border px-2 py-1 font-bold">
                {u.type_compte}
              </td>

              <td className="border px-2 py-1">
                {(u.type_compte === "moniteur" || u.type_compte === "suaps") ? (
                  <select
                    defaultValue={u.type_compte}
                    className="rounded border px-2 py-1 text-sm"
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
    </main>
  );
}