<?php

namespace App\Exports;

use App\Models\Inscription;
use App\Models\Evaluation;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AllActivitesParticipantsExport implements FromArray, WithHeadings
{
    public function array(): array
    {
        $rows = [];

        $inscriptions = Inscription::with([
            'user',
            'activite.site',
            'activite.typeEvenement',
        ])
        ->where('statut', 'valide')
        ->get();

        foreach ($inscriptions as $ins) {

            $act = $ins->activite;

            // 🔥 récupérer l'évaluation
            $evaluation = Evaluation::with('moniteur.user')
                ->where('activite_id', $act->id)
                ->where('etudiant_id', $ins->user_id)
                ->first();

            $rows[] = [
                // ACTIVITÉ
                $act?->libelle,
                $act?->periode,
                $act?->type_activite,
                $act?->site?->nom,
                $act?->typeEvenement?->libelle,

                // INSCRIT
                $ins->user?->nom,
                $ins->user?->prenom,
                $ins->date_inscription_def,

                // ÉVALUATION
                $evaluation?->note,
                $evaluation?->moniteur?->user
                    ? $evaluation->moniteur->user->nom . ' ' . $evaluation->moniteur->user->prenom
                    : null,
            ];
        }

        return $rows;
    }

    public function headings(): array
    {
        return [
            'Activité',
            'Période',
            'Type activité',
            'Site',
            'Type événement',
            'Nom',
            'Prénom',
            'Date inscription',
            'Note',
            'Moniteur évaluateur',
        ];
    }
}