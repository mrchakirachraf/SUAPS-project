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
            $this->command?->warn("ActiviteSeeder skipped: missing base data (categories/sites/types/moniteurs).");
            return;
        }

        $jours = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
        $periodes = ['S1','S2','S1/S2'];
        $statuts = ['ouverte','fermee'];
        $typesActivite = ['évaluée','competitif','non évaluée','évaluée/competitive'];
        $horaires = ['08:00-10:00','10:00-12:00','14:00-16:00','16:00-18:00','18:00-20:00'];
        $suffixes = ['Initiation','Intermédiaire','Avancé','Loisir','Tournoi','Entraînement'];

        $target = 30;   // ✅ EXACT number of activities you want
        $created = 0;

        // We try multiple attempts to ensure we reach exactly 30 unique rows
        $attempts = 0;

        while ($created < $target && $attempts < 500) {
            $attempts++;

            $cat = $categories->random();
            $site = $sites->random();
            $typeEvt = $types->random();
            $moniteur = $moniteurs->random();

            $jour = $jours[array_rand($jours)];
            // optional: sometimes day is null for events (manifestation/competition)
            if (in_array($typeEvt->libelle, ['Manifestation','Compétition'], true) && rand(0, 5) === 0) {
                $jour = null;
            }

            $periode = $periodes[array_rand($periodes)];
            $horaire = $horaires[array_rand($horaires)];
            $statut  = $statuts[array_rand($statuts)];
            $tAct    = $typesActivite[array_rand($typesActivite)];
            $visible = (rand(1, 10) <= 8); // 80% visible

            // Make libelle unique-ish to avoid duplicates when re-running
            $libelle = $cat->nom.' - '.$suffixes[array_rand($suffixes)].' ('.$site->nom.') #'.($created + 1);

            // Use firstOrCreate so we don't create duplicates if you run again
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
                    'date_limite_inscription_s1' => '2026-02-01',
                    'date_limite_note_s1' => '2026-02-15',
                    'date_limite_inscription_s2' => '2026-03-01',
                    'date_limite_note_s2' => '2026-03-15',
                    'statut' => $statut,
                    'visible' => $visible,
                    'categorie_id' => $cat->id,
                    'site_id' => $site->id,
                    'type_evenement_id' => $typeEvt->id,
                    'moniteur_id' => $moniteur->id,
                ]
            );

            // Only count if it was newly created
            if ($act->wasRecentlyCreated) {
                $created++;
            }
        }

        $this->command?->info("✅ ActiviteSeeder: created {$created} activities.");
    }
}
