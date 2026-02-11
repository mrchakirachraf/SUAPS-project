<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Secretariat;

class SecretariatSeeder extends Seeder
{
    public function run(): void
    {
        $secretariats = [
            ['nom'=>'GARDY','prenom'=>'Dolorès','email'=>'dolores.gardy@univ-littoral.fr'],
            ['nom'=>'VERMERSCH','prenom'=>'Karine','email'=>'secr-dt@univ-littoral.fr'],
            ['nom'=>'CALLENS','prenom'=>'Coralie','email'=>'coralie.callens@univ-littoral.fr'],
            ['nom'=>'BAQUET','prenom'=>'Florence','email'=>'florence.baquet@univ-littoral.fr'],
            ['nom'=>'CONDETTE','prenom'=>'Elodie','email'=>'licence.droit@univ-littoral.fr'],
            ['nom'=>'RENAUD','prenom'=>'Myriam','email'=>'laplpro.droit@univ-littoral.fr'],
            ['nom'=>'RENAUD','prenom'=>'Myriam','email'=>'master.droit@univ-littoral.fr'],
            ['nom'=>'AUGE','prenom'=>'Amandine','email'=>'amandine.auge@univ-littoral.fr'],
            ['nom'=>'ALVAREZ','prenom'=>'Emmanuelle','email'=>'emmanuelle.alvarez@univ-littoral.fr'],
            ['nom'=>'VARENNE','prenom'=>'Sophie','email'=>'stapsc@univ-littoral.fr'],
            ['nom'=>'PIGNATELLI','prenom'=>'Emilie','email'=>'stapsd@univ-littoral.fr'],
            ['nom'=>'NAVET','prenom'=>'Anne-Charlotte','email'=>'stapsbg@univ-littoral.fr'],
            ['nom'=>'NAVET','prenom'=>'Anne-Charlotte','email'=>'anne-charlotte.navet@univ-littoral.fr'],
            ['nom'=>'CANDAES','prenom'=>'Audrey','email'=>'staps.st-omer@univ-littoral.fr'],
            ['nom'=>'LEMAITRE','prenom'=>'Julie','email'=>'secretariatri@eilco.univ-littoral.fr'],
            ['nom'=>'CHAILLEUX','prenom'=>'Marion','email'=>'secretariatgee@eilco.univ-littoral.fr'],
            ['nom'=>'JOLY','prenom'=>'Valérie','email'=>'secretariatcp@eilco.univ-littoral.fr'],
            ['nom'=>'LEHEUDRE','prenom'=>'Martine','email'=>'secretariat-re@eilco.univ-littoral.fr'],
            ['nom'=>'LHERBIER','prenom'=>'Anna','email'=>'anna.lherbier@eilco.univ-littoral.fr'],
            ['nom'=>'BERLY','prenom'=>'Mélina','email'=>'melina.berly@eilco.univ-littoral.fr'],
            ['nom'=>'CADET','prenom'=>'Chloé','email'=>'secretariatinfo@eilco.univ-littoral.fr'],
            ['nom'=>'LOISON','prenom'=>'Laurence','email'=>'secretariatgenieindus@eilco.univ-littoral.fr'],
            ['nom'=>'LANNOY','prenom'=>'Fiona','email'=>'fiona.lannoy@eilco.univ-littoral.fr'],
        ];

        foreach ($secretariats as $s) {
            Secretariat::firstOrCreate(
                ['email' => $s['email']],
                [
                    'nom'       => $s['nom'],
                    'prenom'    => $s['prenom'],
                    'email'     => $s['email'],
                    'telephone' => '+33 6 06 06 06 06', // ✅ FIX HERE
                ]
            );
        }
    }
}
