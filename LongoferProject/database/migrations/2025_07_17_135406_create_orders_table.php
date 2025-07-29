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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('client_code');
              $table->foreign('client_code')->references('codeClient')->on('clients')->restrictOnDelete();
              $table->string('of_code');
            $table->foreign('of_code')->references('codeOf')->on('ofs')->restrictOnDelete();
            $table->integer('Qte');
          
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
