<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Secretariat extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
    ];

    /**
     * Un secrétariat peut être associé à plusieurs étudiants
     */
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }
}