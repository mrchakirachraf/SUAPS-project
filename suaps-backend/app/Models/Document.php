<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'chemin',
        'type',
    ];

    /**
     * Relation polymorphe :
     * le document appartient soit à un Etudiant, soit à un Personnel, etc.
     */
    public function documentable()
    {
        return $this->morphTo();
    }
}