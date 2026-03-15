<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Activite;
use App\Models\Categorie;
use App\Models\Site;
use App\Models\TypeEvenement;
use App\Models\Moniteur;

class ActiviteSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Categorie::all();
        $sites      = Site::all();
        $types      = TypeEvenement::all();
        $moniteurs  = Moniteur::all();

        if ($categories->isEmpty() || $sites->isEmpty() || $types->isEmpty() || $moniteurs->isEmpty()) {
            $this->command?->warn("ActiviteSeeder skipped: missing base data.");
            return;
        }

        $jours = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
        $periodes = ['S1','S2','S1/S2'];
        $statuts = ['ouverte','fermee'];
        $typesActivite = ['évaluée','competitif','non évaluée','évaluée/competitive'];
        $horaires = ['08:00-10:00','10:00-12:00','14:00-16:00','16:00-18:00','18:00-20:00'];
        $suffixes = ['Initiation','Intermédiaire','Avancé','Loisir','Tournoi','Entraînement'];

        $target = 30;
        $created = 0;
        $attempts = 0;

        while ($created < $target && $attempts < 500) {
            $attempts++;

            $cat = $categories->random();
            $site = $sites->random();
            $typeEvt = $types->random();

            $jour = $jours[array_rand($jours)];

            if (in_array($typeEvt->libelle, ['Manifestation','Compétition'], true) && rand(0, 5) === 0) {
                $jour = null;
            }

            $periode = $periodes[array_rand($periodes)];
            $horaire = $horaires[array_rand($horaires)];
            $statut  = $statuts[array_rand($statuts)];
            $tAct    = $typesActivite[array_rand($typesActivite)];
            $visible = (rand(1, 10) <= 8);

            $libelle = $cat->nom.' - '.$suffixes[array_rand($suffixes)].' ('.$site->nom.') #'.($created + 1);

            $dateInsS1 = null;
            $dateNoteS1 = null;
            $dateInsS2 = null;
            $dateNoteS2 = null;

            switch ($periode) {
                case 'S1':
                    $dateInsS1  = '2026-02-01';
                    $dateNoteS1 = '2026-02-15';
                    break;

                case 'S2':
                    $dateInsS2  = '2026-03-01';
                    $dateNoteS2 = '2026-03-15';
                    break;

                case 'S1/S2':
                    $dateInsS1  = '2026-02-01';
                    $dateNoteS1 = '2026-02-15';
                    $dateInsS2  = '2026-03-01';
                    $dateNoteS2 = '2026-03-15';
                    break;
            }

            $act = Activite::firstOrCreate(
                ['libelle' => $libelle],
                [
                    'horaire' => $horaire,
                    'periode' => $periode,
                    'jour' => $jour,
                    'lieu' => $site->nom.' - Complexe sportif',
                    'commentaire' => ($typeEvt->libelle === 'Hebdomadaire')
                        ? 'Séance régulière encadrée.'
                        : 'Événement ponctuel (inscription recommandée).',
                    'type_activite' => $tAct,
                    'description_pre_inscription' => 'Pré-inscription en ligne puis validation du moniteur.',
                    'quota_etudiant' => rand(10, 40),
                    'quota_personnel' => rand(2, 10),
                    'date_limite_inscription_s1' => $dateInsS1,
                    'date_limite_note_s1'        => $dateNoteS1,
                    'date_limite_inscription_s2' => $dateInsS2,
                    'date_limite_note_s2'        => $dateNoteS2,
                    'statut' => $statut,
                    'visible' => $visible,
                    'categorie_id' => $cat->id,
                    'site_id' => $site->id,
                    'type_evenement_id' => $typeEvt->id,
                ]
            );

            if ($act->wasRecentlyCreated) {

                // attach 1 to 3 random moniteurs
                $randomMoniteurs = $moniteurs
                    ->random(rand(1, min(3, $moniteurs->count())))
                    ->pluck('id')
                    ->toArray();

                $act->moniteurs()->sync($randomMoniteurs);

                $created++;
            }
        }

        $this->command?->info("✅ ActiviteSeeder: created {$created} activities.");
    }
}