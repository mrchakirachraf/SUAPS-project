<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorieSeeder::class,
            SiteSeeder::class,
            TypeEvenementSeeder::class,
            SecretariatSeeder::class,
        ]);
    }
}
