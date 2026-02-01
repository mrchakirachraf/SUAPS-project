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




}
