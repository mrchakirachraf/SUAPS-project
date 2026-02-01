<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Moniteur;

class MoniteurSeeder extends Seeder
{
    private function makeEmail(string $nom, string $prenom): string
    {
        // nom.prenom@etu.eilco.univ-littoral.fr (lowercase)
        $nom = mb_strtolower($nom);
        $prenom = mb_strtolower($prenom);

        // remove accents (é -> e, etc.)
        $nom = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $nom) ?: $nom;
        $prenom = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $prenom) ?: $prenom;

        // replace spaces/apostrophes with nothing
        $nom = preg_replace("/[^a-z0-9]+/i", "", $nom);
        $prenom = preg_replace("/[^a-z0-9]+/i", "", $prenom);

        return "{$nom}.{$prenom}@etu.eilco.univ-littoral.fr";
    }

    public function run(): void
    {
        $people = [
            ['prenom' => 'Brahim', 'nom' => 'Khaider', 'is_suaps' => 1],
            ['prenom' => 'Ahmed',  'nom' => 'Sabiri',  'is_suaps' => 0],
            ['prenom' => 'Salma',  'nom' => 'Oubaha',  'is_suaps' => 0],
        ];

        foreach ($people as $p) {
            $email = $this->makeEmail($p['nom'], $p['prenom']);

            // 1) Create or get user (no duplicates)
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'username'    => $p['prenom'].' '.$p['nom'],
                    'nom'         => $p['nom'],
                    'prenom'      => $p['prenom'],
                    'password'    => 'password123',   // auto-hashed by your casts
                    'type_compte' => 'moniteur',      // adjust if you use enum/values
                ]
            );

            // 2) Create or update moniteur linked to this user
            Moniteur::updateOrCreate(
                ['user_id' => $user->id],
                ['is_suaps' => (bool) $p['is_suaps']]
            );
        }
    }
}
