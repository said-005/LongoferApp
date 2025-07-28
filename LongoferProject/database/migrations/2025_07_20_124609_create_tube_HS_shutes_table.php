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
        Schema::create('tube_HS_shutes', function (Blueprint $table) {
            $table->id();
            $table->string('ref_production');
            $table->foreign('ref_production')->references('production_code')->on('productions')->restrictOnDelete();
    
            $table->string('Article');
                  $table->foreign('Article')->references('codeArticle')->on('articles')->restrictOnDelete();
            $table->string('OF');
                $table->foreign('OF')->references('codeOf')->on('ofs')->restrictOnDelete();
            $table->date('Date');
           $table->integer('Qte_Chute_HS');
       
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tube_HS_shutes');
    }
};
