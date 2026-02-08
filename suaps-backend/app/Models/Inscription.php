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
        'moniteur_id',
        'statut',
        'num_tel_etud',
        'user_id',
        'activite_id',
    ];

    public function etudiant() {
        return $this->belongsTo(Etudiant::class);
    }

    public function personnel() {
        return $this->belongsTo(Personnel::class);
    }

    public function moniteur()
    {
        return $this->belongsTo(Moniteur::class);
    }

    public function activite() {
        return $this->belongsTo(Activite::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }


    public function evaluation()
    {
        return $this->hasOne(Evaluation::class, 'etudiant_id', 'user_id')
                    ->where('activite_id', $this->activite_id ?? 0);
    }


}
