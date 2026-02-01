<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Moniteur;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserAdminController extends Controller
{
    /**
     * GET /api/users
     * Liste de tous les utilisateurs (SUAPS uniquement)
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // 🔐 Sécurité
        if ($user->type_compte !== 'suaps') {
            return response()->json([
                'message' => 'Accès interdit'
            ], 403);
        }

        $users = User::select(
            'id',
            'username',
            'nom',
            'prenom',
            'email',
            'type_compte'
        )
        ->orderBy('nom')
        ->get();

        return response()->json([
            'users' => $users
        ]);
    }

}
