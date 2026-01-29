<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeEvenement;

class TypeEvenementSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'Hebdomadaire',
            'Manifestation',
            'Compétition',
        ];

        foreach ($types as $libelle) {
            TypeEvenement::firstOrCreate(['libelle' => $libelle]);
        }
    }
}
