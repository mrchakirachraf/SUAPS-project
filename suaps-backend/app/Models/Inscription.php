<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Inscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_pre_inscription',
        'date_inscription_def',
        'statut',
        'num_tel_etud',
        'etudiant_id',
        'activite_id',
    ];

    public function etudiant() {
        return $this->belongsTo(Etudiant::class);
    }

    public function moniteur()
    {
        return $this->belongsTo(Moniteur::class);
    }

    public function activite() {
        return $this->belongsTo(Activite::class);
    }
}
