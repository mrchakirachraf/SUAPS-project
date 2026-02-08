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
        $user->load(['moniteur', 'personnel', 'etudiant']);

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'type_compte' => $user->type_compte, // ✅ MAINTENANT PRÉSENT!
            'moniteur' => $user->moniteur ? [
                'id' => $user->moniteur->id,
                'user_id' => $user->moniteur->user_id,
                'is_suaps' => (bool) $user->moniteur->is_suaps,
            ] : null,
            
            'personnel' => $user->personnel ? [
                'id' => $user->personnel->id,
            ] : null,
            
            'etudiant' => $user->etudiant ? [
                'id' => $user->etudiant->id,
            ] : null,
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

        // comparer moniteurs.id avec activites.moniteur_id
        // SUAPS OU moniteur créateur
        if (!$moniteur->is_suaps && (int)$activite->moniteur_id !== (int)$moniteur->id) {
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

        if (!$moniteur->is_suaps &&
            (int)$activite->moniteur_id !== (int)$moniteur->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

    try {
        DB::transaction(function () use ($inscription, $validated, $moniteur) {
            if ($validated['action'] === 'valider') {
                $inscription->statut = 'valide';
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
                $inscription->statut = 'refuse';
                $inscription->save();
            }
        });

        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }

        return response()->json(['message' => 'Action effectuée avec succès']);
    }


    public function preInscritDetails($inscriptionId, Request $request)
    {
        $user = $request->user();

        $moniteur = Moniteur::where('user_id', $user->id)->first();
        if (!$moniteur) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $inscription = Inscription::with([
            'user.etudiant',
            'user.personnel.documents',
            'activite'
        ])->findOrFail($inscriptionId);

        // sécurité : même moniteur ou SUAPS
        if (!$moniteur->is_suaps &&
            (int)$inscription->activite->moniteur_id !== (int)$moniteur->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $user = $inscription->user;

        $response = [
            'id' => $inscription->id,
            'nom' => $user->nom,
            'prenom' => $user->prenom,
            'type_compte' => $user->type_compte,
        ];

        if ($user->type_compte === 'etudiant' && $user->etudiant) {
            $response['etudiant'] = [
                'num_carte_etud' => $user->etudiant->num_carte_etud,
                'img_carte_etud' => $user->etudiant->img_carte_etud,
            ];
        }

        if ($user->type_compte === 'personnel' && $user->personnel) {
            $response['documents'] = $user->personnel->documents->map(fn ($doc) => [
                'type' => $doc->type,
                'chemin' => $doc->chemin,
            ]);
        }

        return response()->json($response);
    }

    public function inscrits($activiteId, Request $request)
    {
        $user = $request->user();
        $moniteur = Moniteur::where('user_id', $user->id)->firstOrFail();

        $activite = Activite::with('inscriptions.user')->findOrFail($activiteId);

        if (!$moniteur->is_suaps && $activite->moniteur_id !== $moniteur->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $inscrits = $activite->inscriptions()
            ->where('statut', 'valide')
            ->with(['user', 'evaluation'])
            ->get()
            ->map(fn ($ins) => [
                'id' => $ins->id,
                'etudiant_id' => $ins->user_id,
                'nom' => $ins->user->nom,
                'prenom' => $ins->user->prenom,
                'note' => $ins->evaluation?->note,
            ]);

        return response()->json([
            'est_evaluee' => (bool) $activite->est_evaluee,
            'inscrits' => $inscrits,
        ]);
    }



















    /**
     * 🔼 Transformer un moniteur en SUAPS
     * POST /api/users/{userId}/make-suaps
     */
    public function makeSuaps(Request $request, $userId)
    {
        $authUser = $request->user();

        // 🔐 Sécurité : SUAPS uniquement
        if ($authUser->type_compte !== 'suaps') {
            return response()->json([
                'message' => 'Action non autorisée.'
            ], 403);
        }

        // 🔍 Récupérer le moniteur via user_id
        $moniteur = Moniteur::where('user_id', $userId)->firstOrFail();

        return DB::transaction(function () use ($moniteur) {

            $user = $moniteur->user;

            if ($user->type_compte === 'suaps') {
                return response()->json([
                    'message' => 'Ce compte est déjà SUAPS.'
                ], 400);
            }

            // 🔁 Mise à jour user
            $user->update([
                'type_compte' => 'suaps',
            ]);

            // 🔁 Mise à jour moniteur
            $moniteur->update([
                'is_suaps' => true,
            ]);

            return response()->json([
                'message' => 'Le compte est désormais SUAPS.',
                'user' => [
                    'id' => $user->id,
                    'type_compte' => $user->type_compte,
                ],
                'moniteur' => [
                    'id' => $moniteur->id,
                    'user_id' => $moniteur->user_id,
                    'is_suaps' => $moniteur->is_suaps,
                ],
            ]);
        });
    }

    /**
     * 🔽 Transformer un SUAPS en moniteur
     * POST /api/users/{userId}/make-moniteur
     */
    public function makeMoniteur(Request $request, $userId)
    {
        $authUser = $request->user();

        // 🔐 Sécurité : SUAPS uniquement
        if ($authUser->type_compte !== 'suaps') {
            return response()->json([
                'message' => 'Action non autorisée.'
            ], 403);
        }

        // 🔍 Récupérer le moniteur via user_id
        $moniteur = Moniteur::where('user_id', $userId)->firstOrFail();

        return DB::transaction(function () use ($moniteur) {

            $user = $moniteur->user;

            if ($user->type_compte !== 'suaps') {
                return response()->json([
                    'message' => 'Ce compte n\'est pas un compte SUAPS.'
                ], 400);
            }

            // 🔁 Mise à jour user
            $user->update([
                'type_compte' => 'moniteur',
            ]);

            // 🔁 Mise à jour moniteur
            $moniteur->update([
                'is_suaps' => false,
            ]);

            return response()->json([
                'message' => 'Le compte est redevenu moniteur.',
                'user' => [
                    'id' => $user->id,
                    'type_compte' => $user->type_compte,
                ],
                'moniteur' => [
                    'id' => $moniteur->id,
                    'user_id' => $moniteur->user_id,
                    'is_suaps' => $moniteur->is_suaps,
                ],
            ]);
        });
    }




}
