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
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();

            $table->date('date_pre_inscription');
            $table->date('date_inscription_def')->nullable();

            $table->enum('statut', ['en_cours', 'valide', 'refuse'])->default('en_cours');
            $table->string('num_tel_etud')->nullable();

            $table->foreignId('etudiant_id')->constrained();
            $table->foreignId('activite_id')->constrained();

            $table->timestamps();
            $table->unique(['etudiant_id', 'activite_id']);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
