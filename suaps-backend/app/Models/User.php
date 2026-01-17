<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Champs autorisés en écriture (mass assignment)
     */
    protected $fillable = [
        'username',
        'nom',
        'prenom',
        'email',
        'password',
        'role',
    ];

    /**
     * Champs cachés lors de la sérialisation JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casts automatiques
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /* ============================
       Relations
    ============================ */


    public function etudiant()
    {
        return $this->hasOne(Etudiant::class);
    }

    public function moniteur()
    {
        return $this->hasOne(Moniteur::class);
    }

    public function personnel()
    {
        return $this->hasOne(Personnel::class);
    }

    public function suaps()
    {
        return $this->hasOne(Suaps::class);
    }

}
