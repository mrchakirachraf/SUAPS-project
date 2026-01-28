<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    /**
     * GET /categories
     * Liste de toutes les catégories
     */
    public function index()
    {
        $categories = Categorie::orderBy('nom')->get();

        return response()->json($categories);
    }

    /**
     * GET /categories/{id}
     * Détails d’une catégorie + ses activités visibles
     */
    public function show($id)
    {
        $categorie = Categorie::with([
            'activites' => function ($query) {
                $query->where('visible', true)
                      ->with(['site', 'typeEvenement', 'moniteur.user']);
            }
        ])->findOrFail($id);

        return response()->json($categorie);
    }
}
