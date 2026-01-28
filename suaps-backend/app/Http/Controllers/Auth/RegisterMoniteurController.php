<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Moniteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RegisterMoniteurController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        return DB::transaction(function () use ($validated) {

            $user = User::create([
                'username' => $validated['username'],
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $moniteur = Moniteur::create([
                'user_id' => $user->id,
                'is_suaps' => false,
            ]);

            return response()->json([
                'message' => 'Compte moniteur créé avec succès',
                'moniteur_id' => $moniteur->id,
            ], 201);
        });
    }
}