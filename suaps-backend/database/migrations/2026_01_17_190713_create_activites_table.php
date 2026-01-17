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

            $table->string('libelle');
            $table->string('horaire');
            $table->enum('periode', ['S1', 'S2']);
            $table->string('jour');
            $table->string('lieu')->nullable();

            $table->integer('quota_etudiant');
            $table->integer('quota_personnel');

            $table->enum('statut', ['ouverte', 'fermee'])->default('ouverte');
            $table->boolean('visible')->default(true);

            $table->foreignId('categorie_id')->constrained();
            $table->foreignId('site_id')->constrained();
            $table->foreignId('type_evenement_id')->constrained();
            $table->foreignId('personnel_id')->constrained();

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
