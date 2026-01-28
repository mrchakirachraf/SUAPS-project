<?php

namespace App\Http\Controllers;

use App\Models\TypeEvenement;
use Illuminate\Http\Request;

class TypeEvenementController extends Controller
{
    /**
     * GET /type-evenements
     * Liste des types d'événements
     */
    public function index()
    {
        $types = TypeEvenement::orderBy('libelle')->get();

        return response()->json($types);
    }

    /**
     * GET /type-evenements/{id}
     * Détails d’un type d’événement + activités visibles
     */
    public function show($id)
    {
        $type = TypeEvenement::with([
            'activites' => function ($query) {
                $query->where('visible', true)
                      ->with(['categorie', 'site', 'moniteur.user']);
            }
        ])->findOrFail($id);

        return response()->json($type);
    }
}
