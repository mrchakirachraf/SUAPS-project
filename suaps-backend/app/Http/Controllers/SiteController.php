<?php

namespace App\Http\Controllers;

use App\Models\Site;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    /**
     * GET /sites
     * Liste de tous les sites
     */
    public function index()
    {
        $sites = Site::orderBy('nom')->get();

        return response()->json($sites);
    }

    /**
     * GET /sites/{id}
     * Détails d’un site + activités visibles
     */
    public function show($id)
    {
        $site = Site::with([
            'activites' => function ($query) {
                $query->where('visible', true)
                      ->with(['categorie', 'typeEvenement', 'moniteur.user']);
            }
        ])->findOrFail($id);

        return response()->json($site);
    }
}
