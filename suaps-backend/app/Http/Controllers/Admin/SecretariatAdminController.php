<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Secretariat;
use Illuminate\Http\Request;

class SecretariatAdminController extends Controller
{
    /**
     * GET /api/secretariats
     */
    public function index()
    {
        return response()->json(
            Secretariat::orderBy('nom')->get()
        );
    }

    /**
     * POST /api/secretariats
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'email' => 'required|email|unique:secretariats,email',
            'telephone' => 'required|string|max:30',
        ]);

        $secretariat = Secretariat::create($validated);

        return response()->json($secretariat, 201);
    }

    /**
     * PUT /api/secretariats/{id}
     */
    public function update(Request $request, $id)
    {
        $secretariat = Secretariat::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'email' => 'required|email|unique:secretariats,email,' . $secretariat->id,
            'telephone' => 'required|string|max:30',
        ]);

        $secretariat->update($validated);

        return response()->json($secretariat);
    }

    /**
     * DELETE /api/secretariats/{id}
     */
    public function destroy($id)
    {
        $secretariat = Secretariat::findOrFail($id);
        $secretariat->delete();

        return response()->json(['message' => 'Secrétariat supprimé']);
    }
}
