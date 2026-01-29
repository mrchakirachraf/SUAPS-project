<?php

namespace App\Http\Controllers;

use App\Models\Moniteur;
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

        $moniteur = Moniteur::where('user_id', $user->id)->first();

        return response()->json([
            'is_moniteur' => (bool) $moniteur,
            'is_suaps' => $moniteur ? (bool) $moniteur->is_suaps : false,
            'moniteur' => $moniteur,
        ]);
    }
}
