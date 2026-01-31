<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activites', function (Blueprint $table) {
            $table->id();

            // Infos générales
            $table->string('libelle');
            $table->string('horaire')->nullable();
            $table->string('lieu')->nullable();
            $table->text('commentaire')->nullable();

            // Organisation temporelle
            $table->enum('periode', ['S1', 'S2', 'S1/S2']);
            $table->enum('jour', [
                'lundi',
                'mardi',
                'mercredi',
                'jeudi',
                'vendredi',
                'samedi',
                'dimanche'
            ])->nullable();

            // Type d’activité
            $table->enum('type_activite', [
                'évaluée',
                'competitif',
                'non évaluée',
                'évaluée/competitive'
            ]);

            // Description pré-inscription
            $table->text('description_pre_inscription')->nullable();

            // Quotas
            $table->integer('quota_etudiant')->nullable();
            $table->integer('quota_personnel')->nullable();

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
            $table->foreignId('categorie_id')->constrained()->cascadeOnDelete();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->foreignId('type_evenement_id')->constrained()->cascadeOnDelete();
            $table->foreignId('moniteur_id')->constrained('moniteurs')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activites');
    }
};
