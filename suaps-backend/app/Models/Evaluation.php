<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'note',
        'etudiant_id',
        'activite_id',
    ];

    public function etudiant() {
        return $this->belongsTo(Etudiant::class);
    }

    public function activite() {
        return $this->belongsTo(Activite::class);
    }
}
