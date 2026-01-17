<?php

use App\Models\Etudiant;
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
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();

            $table->float('note')->nullable();
            
            $table->foreignId('moniteur_id')->constrained('moniteurs');
            $table->foreignId('etudiant_id')->constrained();
            $table->foreignId('activite_id')->constrained();

            $table->timestamps();
            // Empêcher les doublons
            $table->unique(['etudiant_id', 'activite_id']);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
