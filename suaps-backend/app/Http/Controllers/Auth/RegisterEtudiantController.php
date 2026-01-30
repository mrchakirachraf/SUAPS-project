<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Etudiant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RegisterEtudiantController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            // User
            'username' => 'required|string|unique:users',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',

            // Etudiant
            'num_carte_etud' => 'required|string|unique:etudiants',
            'formation' => 'required|string',
            'img_carte_etud' => 'required|image|mimes:jpg,jpeg,png|max:4048',

            // Secretariat (sélection)
            'secretariat_id' => 'required|exists:secretariats,id',
        ]);

        return DB::transaction(function () use ($validated, $request) {

            // Création utilisateur
            $user = User::create([
                'username' => $validated['username'],
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'type_compte' => 'etudiant',
            ]);

            // Stockage de l'image
            $path = $request->file('img_carte_etud')
                ->store('cartes_etudiants', 'private');

            // Création étudiant
            $etudiant = Etudiant::create([
                'user_id' => $user->id,
                'num_carte_etud' => $validated['num_carte_etud'],
                'formation' => $validated['formation'],
                'img_carte_etud' => $path,
                'nb_activites_inscrits' => 0,
                'secretariat_id' => $validated['secretariat_id'],
            ]);

            return response()->json([
                'message' => 'Compte étudiant créé avec succès',
                'user_id' => $user->id,
                'etudiant_id' => $etudiant->id,
            ], 201);
        });
    }
}