<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activite_moniteur', function (Blueprint $table) {
            $table->id();

            $table->foreignId('activite_id')
                ->constrained('activites')
                ->cascadeOnDelete();

            $table->foreignId('moniteur_id')
                ->constrained('moniteurs')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique(['activite_id', 'moniteur_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activite_moniteur');
    }
};