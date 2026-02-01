<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::with(['moniteur', 'personnel', 'etudiant'])
            ->where('email', $credentials['email'])
            ->first();


        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        // Supprime les anciens tokens (optionnel)
        $user->tokens()->delete();

        // Création du token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'type_compte' => $user->type_compte,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,

                // ✅ important pour le front
                'moniteur' => $user->moniteur ? [
                    'id' => $user->moniteur->id,
                    'is_suaps' => (bool) $user->moniteur->is_suaps,
                ] : null,

                'personnel' => $user->personnel ? [
                    'id' => $user->personnel->id,
                ] : null,

                'etudiant' => $user->etudiant ? [
                    'id' => $user->etudiant->id,
                ] : null,
            ],
        ]);

    }
}
