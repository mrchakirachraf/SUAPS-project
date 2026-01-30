<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Site;
use App\Models\TypeEvenement;

class ActiviteFiltersController extends Controller
{
    public function index()
    {
        // 🔹 ENUMS (backend source of truth)
        $jours = [
            'lundi', 'mardi', 'mercredi',
            'jeudi', 'vendredi', 'samedi', 'dimanche'
        ];

        $periodes = ['S1', 'S2'];

        $statuts = ['ouverte', 'fermee'];

        $typesActivite = [
            'évaluée',
            'competitif',
            'non évaluée',
            'évaluée/competitive'
        ];

        return response()->json([
            "categories"     => Categorie::orderBy('nom')->get(),
            "sites"          => Site::orderBy('nom')->get(),
            "types"          => TypeEvenement::orderBy('libelle')->get(),

            // ENUMS
            "jours"          => $jours,
            "periodes"       => $periodes,
            "statuts"        => $statuts,
            "types_activite" => $typesActivite,
        ]);
    }
}
