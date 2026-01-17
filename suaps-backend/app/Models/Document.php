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
        'date_creation',
        'etudiant_id',
    ];

    public function etudiant() {
        return $this->belongsTo(Etudiant::class);
    }
}
