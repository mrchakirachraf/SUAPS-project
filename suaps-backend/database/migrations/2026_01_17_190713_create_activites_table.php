<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activites', function (Blueprint $table) {
            $table->id();

            // Infos générales
            $table->string('libelle');
            $table->string('horaire');

            // Organisation temporelle
            $table->enum('periode', ['S1', 'S2']);
            $table->enum('jour', [
                'lundi',
                'mardi',
                'mercredi',
                'jeudi',
                'vendredi',
                'samedi',
                'dimanche'
            ])->nullable(); // null si événement ponctuel

            $table->string('lieu')->nullable();

            // Quotas
            $table->integer('quota_etudiant');
            $table->integer('quota_personnel');

            // Dates limites S1
            $table->date('date_limite_inscription_s1')->nullable();
            $table->date('date_limite_note_s1')->nullable();

            // Dates limites S2
            $table->date('date_limite_inscription_s2')->nullable();
            $table->date('date_limite_note_s2')->nullable();

            // Statut & visibilité
            $table->enum('statut', ['ouverte', 'fermee'])->default('ouverte');
            $table->boolean('visible')->default(true);

            // Relations
            $table->foreignId('categorie_id')->constrained();
            $table->foreignId('site_id')->constrained();
            $table->foreignId('type_evenement_id')->constrained();
            $table->foreignId('moniteur_id')->constrained('moniteurs');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activites');
    }
};
