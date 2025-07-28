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
        Schema::create('reparations', function (Blueprint $table) {
            $table->string('code_Reparation')->primary();
            $table->date('date_reparation');
            $table->string('ref_production');
            $table->foreign('ref_production')->references('production_code')->on('productions')->restrictOnDelete();
          $table->string('machine');
              $table->foreign('machine')->references('codeMachine')->on('machines')->restrictOnDelete();
            $table->string('statut');
               $table->foreign('statut')->references('Statut')->on('tube_statuts')->restrictOnDelete();
            $table->string('defaut')->nullable();
             $table->foreign('defaut')->references('codeDefaut')->on('defauts')->restrictOnDelete();
            $table->string('causse')->nullable();
             $table->foreign('causse')->references('code_causse')->on('causses')->restrictOnDelete();
            $table->string('operateur');
             $table->foreign('operateur')->references('operateur')->on('operateurs')->restrictOnDelete();
            $table->string('soudeur')->nullable();
             $table->foreign('soudeur')->references('operateur')->on('operateurs')->restrictOnDelete();
            $table->string('controleur')->nullable();
              $table->foreign('controleur')->references('operateur')->on('operateurs')->restrictOnDelete();
               $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reparations');
    }
};
