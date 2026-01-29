<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categorie;

class CategorieSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Football',
            'Basketball',
            'Handball',
            'Volleyball',
            'Natation',
            'Musculation',
            'Athlétisme',
            'Badminton',
        ];

        foreach ($categories as $nom) {
            Categorie::firstOrCreate(
                ['nom' => $nom],
                ['image' => null]
            );
        }
    }
}
