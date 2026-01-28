<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use App\Models\Categorie;
use App\Models\Site;
use App\Models\TypeEvenement;
use Illuminate\Support\Facades\DB;

class ActiviteFiltersController extends Controller
{
    public function index()
    {
        // 🔹 ENUMS directement depuis la structure de la table
        $jours = [
            'lundi', 'mardi', 'mercredi',
            'jeudi', 'vendredi', 'samedi', 'dimanche'
        ];

        $periodes = ['S1', 'S2'];

        $statuts = ['ouverte', 'fermee'];

        return response()->json([
            "categories" => Categorie::orderBy('nom')->get(),
            "sites"      => Site::orderBy('nom')->get(),
            "types"      => TypeEvenement::orderBy('libelle')->get(),

            // ENUMS (source backend)
            "jours"      => $jours,
            "periodes"   => $periodes,
            "statuts"    => $statuts,
        ]);
    }
}
