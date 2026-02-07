<?php

namespace App\Http\Controllers;

use App\Models\Secretariat;
use Illuminate\Http\Request;

class SecretariatController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'email' => 'required|string|min:3',
        ]);

        return Secretariat::where('email', 'like', '%' . $request->email . '%')
            ->select('id', 'nom', 'prenom', 'email')
            ->orderBy('nom')
            ->get();
    }
}