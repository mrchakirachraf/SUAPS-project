<?php

namespace App\Http\Controllers;

use App\Models\Moniteur;
use App\Models\Inscription;
use App\Models\Activite;
use App\Models\Evaluation;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MoniteurController extends Controller
{
    /**
     * GET /api/moniteurs
     * Query params:
     * - is_suaps (0/1)
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'is_suaps' => ['nullable', Rule::in(['0','1',0,1,true,false,'true','false'])],
        ]);

        $q = Moniteur::query()
            ->with(['user']);

        if (array_key_exists('is_suaps', $validated)) {
            $isSuaps = in_array($validated['is_suaps'], [1,'1',true,'true'], true);
            $q->where('is_suaps', $isSuaps);
        }

        return response()->json(
            $q->orderByDesc('created_at')->get()
        );
    }

    /**
     * GET /api/moniteurs/{id}
     * Détails d’un moniteur + user + activités visibles
     */
    public function show($id)
    {
        $moniteur = Moniteur::with([
            'user',
            'activites' => function ($q) {
                $q->where('visible', true)
                  ->with(['categorie', 'site', 'typeEvenement']);
            }
        ])->findOrFail($id);

        return response()->json($moniteur);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        $moniteur = Moniteur::where('user_id', $user->id)->first();

        return response()->json([
            'is_moniteur' => (bool) $moniteur,
            'is_suaps' => $moniteur ? (bool) $moniteur->is_suaps : false,
            'moniteur' => $moniteur,
        ]);
    }

    public function preInscrits($activiteId, Request $request)
    {
        $user = $request->user();

        $moniteur = Moniteur::where('user_id', $user->id)->first();
        if (!$moniteur) {
            return response()->json(['message' => 'Accès refusé (non moniteur)'], 403);
        }

        $activite = Activite::with(['inscriptions.user'])->findOrFail($activiteId);

        // ✅ comparer moniteurs.id avec activites.moniteur_id
        if ((int)$activite->moniteur_id !== (int)$moniteur->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $preInscrits = $activite->inscriptions()
            ->where('statut', 'en_cours')
            ->with('user')
            ->get()
            ->map(function ($ins) {
                return [
                    'id' => $ins->id,
                    'user_id' => $ins->user_id,
                    'nom' => $ins->user->nom ?? $ins->user->username,
                    'prenom' => $ins->user->prenom ?? "",
                    'num_tel_etud' => $ins->num_tel_etud,
                    'date_pre_inscription' => $ins->date_pre_inscription,
                ];
            });

        return response()->json([
            'activite_id' => $activite->id,
            'libelle' => $activite->libelle,
            'preInscrits' => $preInscrits,
        ]);
    }


    /**
     * POST /api/inscriptions/{id}/valider
     * Valider ou refuser un pré-inscrit + noter
     * Body: { action: 'valider'|'refuser', note: optional }
     */
    public function validerInscription(Request $request, $inscriptionId)
    {
        $user = $request->user();

        $moniteur = Moniteur::where('user_id', $user->id)->first();
        if (!$moniteur) {
            return response()->json(['message' => 'Accès refusé (non moniteur)'], 403);
        }

        $validated = $request->validate([
            'action' => 'required|in:valider,refuser',
            'note' => 'nullable|numeric|min:0|max:20',
        ]);

        $inscription = Inscription::with('activite')->findOrFail($inscriptionId);
        $activite = $inscription->activite;

        if ((int)$activite->moniteur_id !== (int)$moniteur->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        DB::transaction(function () use ($inscription, $validated, $moniteur) {
            if ($validated['action'] === 'valider') {
                $inscription->statut = 'validée';
                $inscription->date_inscription_def = now();
                $inscription->save();

                if (isset($validated['note'])) {
                    Evaluation::updateOrCreate(
                        [
                            'activite_id' => $inscription->activite_id,
                            'etudiant_id' => $inscription->user_id,
                            'moniteur_id' => $moniteur->id, // ✅ moniteurs.id
                        ],
                        ['note' => $validated['note']]
                    );
                }
            } else {
                $inscription->statut = 'refusée';
                $inscription->save();
            }
        });

        return response()->json(['message' => 'Action effectuée avec succès']);
    }





}
