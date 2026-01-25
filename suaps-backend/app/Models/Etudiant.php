<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory;

    protected $fillable = [
        'num_carte_etud',
        'img_carte_etud',
        'formation',
        'nb_activites_inscrits',
        'user_id',
        'secretariat_id',
    ];

    /* =====================
       Relations
    ===================== */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function secretariat()
    {
        return $this->belongsTo(Secretariat::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
