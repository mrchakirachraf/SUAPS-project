<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserAdminController extends Controller
{
    /**
     * GET /api/users
     * Liste de tous les utilisateurs (SUAPS uniquement)
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // 🔐 Sécurité
        if ($user->type_compte !== 'suaps') {
            return response()->json([
                'message' => 'Accès interdit'
            ], 403);
        }

        $users = User::select(
            'id',
            'username',
            'nom',
            'prenom',
            'email',
            'type_compte'
        )
        ->orderBy('nom')
        ->get();

        return response()->json([
            'users' => $users
        ]);
    }

        /**
     * GET /api/users/{id}
     * Détails d'un utilisateur + infos étudiant (si type_compte = etudiant)
     */
    public function show(Request $request, $id)
    {
        $auth = $request->user();

        if ($auth->type_compte !== 'suaps') {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

        $user = User::with('etudiant')->select(
            'id','username','nom','prenom','email','type_compte'
        )->findOrFail($id);

        return response()->json([
            'user' => $user,
            'etudiant' => $user->etudiant, // null si pas étudiant
        ]);
    }

    /**
     * PUT /api/users/{id}
     * Update user + (si étudiant) update etudiant
     */
    public function update(Request $request, $id)
    {
        $auth = $request->user();
        if ($auth->type_compte !== 'suaps') {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

        $user = User::with('etudiant')->findOrFail($id);

        // ✅ validation USER
        $validated = $request->validate([
            'username' => ['required','string','max:50', Rule::unique('users','username')->ignore($user->id)],
            'nom'      => ['required','string','max:255'],
            'prenom'   => ['required','string','max:255'],
            'email'    => ['required','email','max:100', Rule::unique('users','email')->ignore($user->id)],

            // ✅ étudiant
            'num_carte_etud' => ['nullable','string','max:255'],
            'formation'      => ['nullable','string','max:255'],
            'secretariat_id' => ['nullable','integer','exists:secretariats,id'],

            // ✅ image (optionnelle en update)
            'img_carte_etud' => ['nullable','image','mimes:jpg,jpeg,png','max:4048'],

            // ✅ optionnel: reset mdp
            'password' => ['nullable','string','min:8','confirmed'],
        ]);

        // update user
        $user->update([
            'username' => $validated['username'],
            'nom'      => $validated['nom'],
            'prenom'   => $validated['prenom'],
            'email'    => $validated['email'],
        ]);

        // reset password optionnel
        if ($request->filled('password')) {
            $user->update(['password' => \Illuminate\Support\Facades\Hash::make($validated['password'])]);
        }

        if ($user->type_compte === 'etudiant') {
            if (!$user->etudiant) {
                return response()->json(['message' => "Profil étudiant introuvable."], 404);
            }

            // unique num carte si fourni
            if ($request->filled('num_carte_etud')) {
                $request->validate([
                    'num_carte_etud' => [
                        'string','max:255',
                        Rule::unique('etudiants','num_carte_etud')->ignore($user->etudiant->id)
                    ],
                ]);
            }

            $updateEtu = [
                'num_carte_etud' => $validated['num_carte_etud'] ?? $user->etudiant->num_carte_etud,
                'formation'      => $validated['formation'] ?? $user->etudiant->formation,
                'secretariat_id' => $validated['secretariat_id'] ?? $user->etudiant->secretariat_id,
            ];

            // upload image si présente
            if ($request->hasFile('img_carte_etud')) {
                $path = $request->file('img_carte_etud')->store('cartes_etudiants', 'private');
                $updateEtu['img_carte_etud'] = $path;
            }

            $user->etudiant->update($updateEtu);
        }

        return response()->json(['message' => 'Utilisateur mis à jour']);
    }

    public function carteEtudiant(Request $request, $id)
    {
        $auth = $request->user();
        if ($auth->type_compte !== 'suaps') {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

        $user = User::with('etudiant')->findOrFail($id);
        if (!$user->etudiant || !$user->etudiant->img_carte_etud) {
            return response()->json(['message' => 'Aucune image'], 404);
        }

        $path = $user->etudiant->img_carte_etud;

        return Storage::response($path);
    }



}
