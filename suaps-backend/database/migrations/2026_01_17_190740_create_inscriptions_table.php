<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();

            $table->date('date_pre_inscription');
            $table->date('date_inscription_def')->nullable();

            $table->enum('statut', ['en_cours', 'valide', 'refuse'])
                  ->default('en_cours');

            $table->string('num_tel_etud')->nullable();

            $table->foreignId('user_id')->constrained();
            $table->foreignId('activite_id')->constrained();

            $table->timestamps();

            // prevent duplicate registration
            $table->unique(['user_id', 'activite_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};