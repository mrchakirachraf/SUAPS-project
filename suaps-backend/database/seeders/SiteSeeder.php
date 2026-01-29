<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Site;

class SiteSeeder extends Seeder
{
    public function run(): void
    {
        $sites = [
            'Calais',
            'Dunkerque',
            'Boulogne-sur-mer',
            'Saint-Omer',
        ];

        foreach ($sites as $nom) {
            Site::firstOrCreate(['nom' => $nom]);
        }
    }
}
