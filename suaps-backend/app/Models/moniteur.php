<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Moniteur extends Model
{
    use HasFactory;

    protected $table = 'moniteurs';

    protected $fillable = [
        'user_id',
        'is_suaps',
    ];

    protected $casts = [
        'is_suaps' => 'boolean',
    ];



    /* =====================
       Relations
    ===================== */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Activités encadrées par le moniteur
     */
    // public function activites()
    // {
    //     return $this->hasMany(Activite::class);
    // }

    public function activites()
    {
        return $this->belongsToMany(Activite::class, 'activite_moniteur');
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function isSuaps(): bool
    {
        return $this->is_suaps;
    }
}
