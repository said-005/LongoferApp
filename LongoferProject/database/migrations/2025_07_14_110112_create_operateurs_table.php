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
   Schema::create('operateurs', function (Blueprint $table) {
    $table->string('operateur')->primary();
    $table->string('nom_complete');
    $table->string('Fonction');

    // Make sure this exactly matches machines.codeMachine
    $table->string('Machine')->nullable();

    $table->foreign('Machine')
          ->references('codeMachine')
          ->on('machines')
          ->restrictOnDelete();

    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operateurs');
    }
};
