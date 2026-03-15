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
        'commentaire',
        'quota_etudiant',
        'quota_personnel',
        'type_activite',
        'description_pre_inscription',
        'date_limite_inscription_s1',
        'date_limite_note_s1',
        'date_limite_inscription_s2',
        'date_limite_note_s2',
        'statut',
        'visible',
        'categorie_id',
        'site_id',
        'type_evenement_id',
        'moniteur_id',
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

    // public function moniteur()
    // {
    //     return $this->belongsTo(Moniteur::class);
    // }
    
    public function moniteurs()
    {
        return $this->belongsToMany(Moniteur::class, 'activite_moniteur');
    }
    
    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }


    public function inscriptions() {
        return $this->hasMany(Inscription::class);
    }
}
