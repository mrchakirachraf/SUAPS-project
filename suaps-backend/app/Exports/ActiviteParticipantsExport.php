<?php
namespace App\Exports;

use App\Models\Inscription;
use App\Models\Evaluation;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ActiviteParticipantsExport implements FromArray, WithHeadings
{
    protected $activiteId;

    public function __construct($activiteId)
    {
        $this->activiteId = $activiteId;
    }

    public function array(): array
    {
        $rows = [];

        $inscriptions = Inscription::with('user')
            ->where('activite_id', $this->activiteId)
            ->get();

        foreach ($inscriptions as $ins) {

            $evaluation = Evaluation::with('moniteur.user')
                ->where('activite_id', $this->activiteId)
                ->where('etudiant_id', $ins->user_id)
                ->first();

            $rows[] = [
                $ins->user->nom,
                $ins->user->prenom,
                $ins->statut,
                $ins->date_pre_inscription,
                $evaluation?->note,
                $evaluation?->moniteur?->user?->nom
                    ? $evaluation->moniteur->user->nom . " " . $evaluation->moniteur->user->prenom
                    : null
            ];
        }

        return $rows;
    }

    public function headings(): array
    {
        return [
            'Nom',
            'Prénom',
            'Statut',
            'Date pré-inscription',
            'Note',
            'Moniteur évaluateur'
        ];
    }
}