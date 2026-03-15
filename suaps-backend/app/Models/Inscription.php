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
        'user_id',
        'activite_id',
    ];

    /* =====================
       Relations
    ===================== */

    public function activite()
    {
        return $this->belongsTo(Activite::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }

    /**
     * Evaluation linked to this inscription
     * (same student + same activity)
     */
    public function evaluation()
    {
        return $this->hasOne(Evaluation::class, 'etudiant_id', 'user_id')
            ->whereColumn('evaluations.activite_id', 'inscriptions.activite_id');
    }
}