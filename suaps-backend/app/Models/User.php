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

    /**
     * Relation vers le profil étudiant
     */
    public function etudiant()
    {
        return $this->hasOne(Etudiant::class);
    }

    /**
     * Relation vers le profil personnel / moniteur
     */
    public function personnel()
    {
        return $this->hasOne(Personnel::class);
    }

    /* ============================
       Helpers rôles (TRÈS UTILE)
    ============================ */

    public function isEtudiant(): bool
    {
        return $this->role === 'etudiant';
    }

    public function isPersonnel(): bool
    {
        return in_array($this->role, ['personnel', 'moniteur']);
    }

    public function isSuaps(): bool
    {
        return $this->role === 'suaps';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
