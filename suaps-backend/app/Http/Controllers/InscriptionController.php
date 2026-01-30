<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use App\Models\Inscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InscriptionController extends Controller
{
    /**
     * POST /api/activites/{id}/inscriptions
     * Body:
     * - num_tel_etud (optionnel)
     */
    public function register(Request $request, $activiteId)
    {
        $user = $request->user(); // l'utilisateur connecté

        // Validation
        $validated = $request->validate([
            'num_tel_etud' => 'nullable|string|max:20',
        ]);

        $activite = Activite::findOrFail($activiteId);

        return DB::transaction(function () use ($user, $activite, $validated) {

            // Vérifie si déjà inscrit
            if (Inscription::where('user_id', $user->id)
                ->where('activite_id', $activite->id)
                ->exists()
            ) {
                return response()->json([
                    'message' => 'Vous êtes déjà inscrit à cette activité.'
                ], 400);
            }

            // Vérifie quotas
            if ($user->type_compte === 'etudiant' && $activite->quota_etudiant <= 0) {
                return response()->json(['message' => 'Quota étudiant atteint.'], 400);
            }
            if ($user->type_compte === 'personnel' && $activite->quota_personnel <= 0) {
                return response()->json(['message' => 'Quota personnel atteint.'], 400);
            }

            // Crée l'inscription
            $inscription = Inscription::create([
                'user_id' => $user->id,
                'activite_id' => $activite->id,
                'moniteur_id' => $activite->moniteur_id,
                'date_pre_inscription' => now(),
                'statut' => 'en_cours',
                'num_tel_etud' => $validated['num_tel_etud'] ?? null,
            ]);

            // Réduit le quota
            if ($user->type_compte === 'etudiant') {
                $activite->decrement('quota_etudiant');
            } elseif ($user->type_compte === 'personnel') {
                $activite->decrement('quota_personnel');
            }

            return response()->json([
                'message' => 'Inscription réussie.',
                'inscription' => $inscription,
            ], 201);
        });
    }

    /**
     * GET /api/activites/{id}/inscriptions
     * Liste des inscrits à une activité
     */
    public function listInscrits($activiteId)
    {
        $activite = Activite::with(['inscriptions.user'])->findOrFail($activiteId);

        // Retourne chaque inscription avec info user + type
        $inscrits = $activite->inscriptions->map(function ($ins) {
            return [
                'id' => $ins->id,
                'user_id' => $ins->user_id,
                'username' => $ins->user->username,
                'nom' => $ins->user->nom,
                'prenom' => $ins->user->prenom,
                'type_compte' => $ins->user->type_compte,
                'statut' => $ins->statut,
                'num_tel_etud' => $ins->num_tel_etud,
                'date_pre_inscription' => $ins->date_pre_inscription,
                'date_inscription_def' => $ins->date_inscription_def,
            ];
        });

        return response()->json([
            'activite_id' => $activite->id,
            'libelle' => $activite->libelle,
            'inscrits' => $inscrits,
        ]);
    }
}
