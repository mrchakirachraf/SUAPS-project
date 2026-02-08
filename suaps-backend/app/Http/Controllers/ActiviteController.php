<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Moniteur;
use App\Models\User;


class ActiviteController extends Controller
{
    /**
     * GET /api/activites
     * Query params:
     * - page
     * - per_page (default 10, max 50)
     * - search
     * - categorie (nom)
     * - site (nom)
     * - type (type_evenements.libelle)
     * - jour
     * - periode
     * - statut
     * - visible (0/1)  -> si tu veux pouvoir afficher aussi les masquées (admin)
     */
    private function isSuapsMoniteur(?User $user): bool
    {
        if (!$user) return false;

        $moniteur = Moniteur::where('user_id', $user->id)->first();

        return $moniteur ? (bool) $moniteur->is_suaps : false;
    }

    public function index(Request $request)
    {
        $validated = $request->validate([
            'page'      => ['nullable', 'integer', 'min:1'],
            'per_page'  => ['nullable', 'integer', 'min:1', 'max:50'],
            'search'    => ['nullable', 'string', 'max:100'],
            'categorie' => ['nullable', 'string', 'max:100'],
            'site'      => ['nullable', 'string', 'max:100'],
            'type'      => ['nullable', 'string', 'max:100'],
            'type_activite' => ['nullable', Rule::in(['évaluée','competitif','non évaluée','évaluée/competitive'])],
            'jour'      => ['nullable', Rule::in(['tous','lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'])],
            'periode'   => ['nullable', Rule::in(['tous','S1','S2','S1/S2'])],
            'statut'    => ['nullable', Rule::in(['tous','ouverte','fermee'])],
            // keep this if you want: only SUAPS moniteur may use it
            'visible'   => ['nullable', Rule::in(['0','1',0,1,true,false,'true','false'])],
        ]);

        $perPage = (int) ($validated['per_page'] ?? 10);

        $user = $request->user(); // null if not logged in
        $isSuaps = $this->isSuapsMoniteur($user);

        $query = Activite::query()
            ->with(['categorie', 'site', 'typeEvenement', 'moniteur.user']);

        // ✅ visibility rule:
        // - if NOT SUAPS moniteur => always only visible activities
        // - if SUAPS moniteur => can choose visible filter, otherwise see all
        if (!$isSuaps) {
            $query->where('visible', true);
        } else {
            if (array_key_exists('visible', $validated)) {
                $visibleBool = in_array($validated['visible'], [1,'1',true,'true'], true);
                $query->where('visible', $visibleBool);
            }
            // else: no filter => show all (visible + invisible)
        }

        // search
        $query->when(!empty($validated['search'] ?? null), function ($q) use ($validated) {
            $s = $validated['search'];
            $q->where(function ($qq) use ($s) {
                $qq->where('libelle', 'like', "%{$s}%")
                ->orWhere('lieu', 'like', "%{$s}%");
            });
        });

        // categorie
        $query->when(!empty($validated['categorie'] ?? null), function ($q) use ($validated) {
            $cat = $validated['categorie'];
            $q->whereHas('categorie', fn ($qc) => $qc->where('nom', $cat));
        });

        // site
        $query->when(!empty($validated['site'] ?? null), function ($q) use ($validated) {
            $site = $validated['site'];
            $q->whereHas('site', fn ($qs) => $qs->where('nom', $site));
        });

        // type evenement
        $query->when(!empty($validated['type'] ?? null), function ($q) use ($validated) {
            $type = $validated['type'];
            $q->whereHas('typeEvenement', fn ($qt) => $qt->where('libelle', $type));
        });

        // type_activite
        $query->when(!empty($validated['type_activite'] ?? null),
            fn ($q) => $q->where('type_activite', $validated['type_activite'])
        );

        // direct filters
        $query->when(!empty($validated['jour'] ?? null) && $validated['jour'] !== 'tous',
            fn ($q) => $q->where('jour', $validated['jour'])
        );
        $query->when(!empty($validated['periode'] ?? null) && $validated['periode'] !== 'tous',
            fn ($q) => $q->where('periode', $validated['periode'])
        );
        $query->when(!empty($validated['statut'] ?? null) && $validated['statut'] !== 'tous',
            fn ($q) => $q->where('statut', $validated['statut'])
        );

        $query->orderByDesc('created_at');

        return response()->json($query->paginate($perPage));
    }


    /**
     * GET /api/activites/{id}
     * Détails d’une activité
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $isSuaps = $this->isSuapsMoniteur($user);

        $q = Activite::with([
            'categorie',
            'site',
            'typeEvenement',
            'moniteur.user',
            'inscriptions',
            'evaluations'
        ]);

        if (!$isSuaps) {
            $q->where('visible', true);
        }

        $activite = $q->findOrFail($id);

        return response()->json($activite);
    }


    public function store(Request $request)
        {
        $user = $request->user();
        if (!$user || !$this->isSuapsMoniteur($user)) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $validated = $request->validate([
            'libelle' => ['required', 'string', 'max:255'],
            'horaire' => ['nullable', 'string', 'max:100'],
            'periode' => ['required', Rule::in(['S1', 'S2', 'S1/S2'])],
            'jour' => ['required', Rule::in(['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'])],
            'lieu' => ['nullable', 'string', 'max:255'],
            'commentaire' => ['nullable', 'string'],
            'description_pre_inscription' => ['nullable', 'string'],
            'quota_etudiant' => ['required', 'integer', 'min:0'],
            'quota_personnel' => ['required', 'integer', 'min:0'],
            'date_limite_inscription_s1' => ['nullable', 'date'],
            'date_limite_note_s1' => ['nullable', 'date'],
            'date_limite_inscription_s2' => ['nullable', 'date'],
            'date_limite_note_s2' => ['nullable', 'date'],
            'statut' => ['required', Rule::in(['ouverte','fermee'])],
            'visible' => ['required', 'boolean'],
            'categorie_id' => ['required', 'exists:categories,id'],
            'site_id' => ['required', 'exists:sites,id'],
            'type_evenement_id' => ['required', 'exists:type_evenements,id'],
            'moniteur_id' => ['required', 'exists:moniteurs,id'],
            'type_activite' => ['required', Rule::in(['évaluée','competitif','non évaluée','évaluée/competitive'])],
        ]);

        // Crée l'activité
        $activite = Activite::create($validated);

        return response()->json($activite, 201);
    }

    public function showManage(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$this->isSuapsMoniteur($user)) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $activite = Activite::with([
            'categorie',
            'site',
            'typeEvenement',
            'moniteur.user',
            'inscriptions',
            'evaluations'
        ])->findOrFail($id);

        return response()->json($activite);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$this->isSuapsMoniteur($user)) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $activite = Activite::findOrFail($id);

        $validated = $request->validate([
            // Infos générales
            'libelle' => ['required', 'string', 'max:255'],
            'horaire' => ['nullable', 'string', 'max:100'],
            'lieu' => ['nullable', 'string', 'max:255'],
            'commentaire' => ['nullable', 'string'],
            'description_pre_inscription' => ['nullable', 'string'],

            // Organisation temporelle
            'periode' => ['required', Rule::in(['S1', 'S2', 'S1/S2'])],
            'jour' => ['nullable', Rule::in(['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'])],

            // Type d’activité
            'type_activite' => ['required', Rule::in(['évaluée','competitif','non évaluée','évaluée/competitive'])],

            // Quotas
            'quota_etudiant' => ['nullable', 'integer', 'min:0'],
            'quota_personnel' => ['nullable', 'integer', 'min:0'],

            // Dates limites
            'date_limite_inscription_s1' => ['nullable', 'date'],
            'date_limite_note_s1' => ['nullable', 'date'],
            'date_limite_inscription_s2' => ['nullable', 'date'],
            'date_limite_note_s2' => ['nullable', 'date'],

            // Statut & visibilité
            'statut' => ['required', Rule::in(['ouverte','fermee'])],
            'visible' => ['required', 'boolean'],

            // Relations
            'categorie_id' => ['required', 'exists:categories,id'],
            'site_id' => ['required', 'exists:sites,id'],
            'type_evenement_id' => ['required', 'exists:type_evenements,id'],
            'moniteur_id' => ['required', 'exists:moniteurs,id'],
        ]);

        $activite->update($validated);

        // return fresh with relations (useful for front)
        $activite->load(['categorie','site','typeEvenement','moniteur.user']);

        return response()->json($activite);
    }


}
