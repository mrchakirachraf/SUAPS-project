<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Personnel;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RegisterPersonnelController extends Controller
{
    public function register(Request $request)
    {
        // ✅ validation
        $validated = $request->validate([
            'username' => 'required|string|unique:users',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',

            // fichiers obligatoires
            'doc_personnel' => 'required|file',
            'doc_responsabilite' => 'required|file',
            'doc_sante' => 'required|file',
        ]);

        return DB::transaction(function () use ($request, $validated) {

            // 👤 user
            $user = User::create([
                'username' => $validated['username'],
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // 👔 personnel
            $personnel = Personnel::create([
                'user_id' => $user->id,
            ]);

            // 📁 documents
            $documents = [
                'doc_personnel' => 'doc_personnel',
                'doc_responsabilite' => 'doc_responsabilite',
                'doc_sante' => 'doc_sante',
            ];

            foreach ($documents as $input => $type) {
                $path = $request->file($input)
                    ->store('DocumentsPersonnel', 'private');

                $personnel->documents()->create([
                    'chemin' => $path,
                    'type' => $type,
                    ]);
            }

            return response()->json([
                'message' => 'Compte personnel créé avec succès',
            ], 201);
        });
    }
}