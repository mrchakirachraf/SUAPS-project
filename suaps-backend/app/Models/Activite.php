<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activite extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'horaire',
        'periode',
        'jour',
        'lieu',
        'quota_etudiant',
        'quota_personnel',
        'statut',
        'visible',
        'categorie_id',
        'site_id',
        'type_evenement_id',
        'personnel_id',
    ];

    public function categorie() {
        return $this->belongsTo(Categorie::class);
    }

    public function site() {
        return $this->belongsTo(Site::class);
    }

    public function typeEvenement() {
        return $this->belongsTo(TypeEvenement::class);
    }

    public function personnel() {
        return $this->belongsTo(Personnel::class);
    }

    public function inscriptions() {
        return $this->hasMany(Inscription::class);
    }
}
