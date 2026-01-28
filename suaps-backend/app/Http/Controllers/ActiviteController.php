<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use Illuminate\Http\Request;

class ActiviteController extends Controller
{
    /**
     * GET /activites
     * Lister les activités (page liste)
     */
    public function index(Request $request)
    {
        $activites = Activite::with([
                'categorie',
                'site',
                'typeEvenement',
                'moniteur'
            ])
            ->where('visible', true)
            ->orderBy('created_at', 'desc')
            ->paginate(10); // pagination propre

        return response()->json($activites);
    }

    /**
     * GET /activites/{id}
     * Détails d’une activité
     */
    public function show($id)
    {
        $activite = Activite::with([
                'categorie',
                'site',
                'typeEvenement',
                'moniteur',
                'inscriptions',
                'evaluations'
            ])->findOrFail($id);

        return response()->json($activite);
    }
}