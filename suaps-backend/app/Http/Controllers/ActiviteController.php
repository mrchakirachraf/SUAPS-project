<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
    public function index(Request $request)
    {
        // ✅ Validation légère (évite les valeurs bizarres)
        $validated = $request->validate([
            'page'      => ['nullable', 'integer', 'min:1'],
            'per_page'  => ['nullable', 'integer', 'min:1', 'max:50'],
            'search'    => ['nullable', 'string', 'max:100'],
            'categorie' => ['nullable', 'string', 'max:100'],
            'site'      => ['nullable', 'string', 'max:100'],
            'type'      => ['nullable', 'string', 'max:100'],
            'type_activite' => [
                'nullable',
                Rule::in([
                    'évaluée',
                    'competitif',
                    'non évaluée',
                    'évaluée/competitive'
                ])
            ],
            'jour'    => ['nullable', Rule::in(['tous','lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'])],
            'periode' => ['nullable', Rule::in(['tous','S1','S2'])],
            'statut'  => ['nullable', Rule::in(['tous','ouverte','fermee'])],
            'visible'   => ['nullable', Rule::in(['0', '1', 0, 1, true, false])],
        ]);

        $perPage = (int) ($validated['per_page'] ?? 10);

        $query = Activite::query()
            ->with(['categorie', 'site', 'typeEvenement', 'moniteur.user'])
            // ✅ par défaut: visibles uniquement
            ->when(
                !array_key_exists('visible', $validated),
                fn ($q) => $q->where('visible', true)
            )
            // ✅ si visible est fourni, on respecte la valeur
            ->when(
                array_key_exists('visible', $validated),
                fn ($q) => $q->where('visible', in_array($validated['visible'], [1, '1', true, 'true'], true))

            )
            // ✅ recherche (libelle + lieu)
            ->when(!empty($validated['search'] ?? null), function ($q) use ($validated) {
                $s = $validated['search'];
                $q->where(function ($qq) use ($s) {
                    $qq->where('libelle', 'like', "%{$s}%")
                       ->orWhere('lieu', 'like', "%{$s}%");
                });
            })
            // ✅ filtre catégorie par nom
            ->when(!empty($validated['categorie'] ?? null), function ($q) use ($validated) {
                $cat = $validated['categorie'];
                $q->whereHas('categorie', fn ($qc) => $qc->where('nom', $cat));
            })
            // ✅ filtre site par nom
            ->when(!empty($validated['site'] ?? null), function ($q) use ($validated) {
                $site = $validated['site'];
                $q->whereHas('site', fn ($qs) => $qs->where('nom', $site));
            })
            // ✅ filtre type_evenement par libelle
            ->when(!empty($validated['type'] ?? null), function ($q) use ($validated) {
                $type = $validated['type'];
                $q->whereHas('typeEvenement', fn ($qt) => $qt->where('libelle', $type));
            })
            // filtres by type activité
            ->when(
                !empty($validated['type_activite'] ?? null),
                fn ($q) => $q->where('type_activite', $validated['type_activite'])
            )


            // ✅ filtres directs
            ->when(!empty($validated['jour'] ?? null) && $validated['jour'] !== 'tous',
                fn ($q) => $q->where('jour', $validated['jour'])
            )
            ->when(!empty($validated['periode'] ?? null) && $validated['periode'] !== 'tous',
                fn ($q) => $q->where('periode', $validated['periode'])
            )
            ->when(!empty($validated['statut'] ?? null) && $validated['statut'] !== 'tous',
                fn ($q) => $q->where('statut', $validated['statut'])
            )
            // ✅ tri
            ->orderByDesc('created_at');

        // ✅ paginate retourne: data, current_page, last_page, total, per_page...
        return response()->json(
            $query->paginate($perPage)
        );
    }

    /**
     * GET /api/activites/{id}
     * Détails d’une activité
     */
    public function show($id)
    {
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
}
