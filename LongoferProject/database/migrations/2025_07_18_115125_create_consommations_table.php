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
        Schema::create('consommations', function (Blueprint $table) {
            $table->id();
            $table->string('ArticleMatiere');
              $table->foreign('ArticleMatiere')->references('codeArticle')->on('articles')->restrictOnDelete();
            $table->date('Date');
            $table->string('Num_LotOF')->nullable();
            $table->string('OF');
            $table->foreign('OF')->references('codeOf')->on('ofs')->restrictOnDelete();
            $table->string('ArticleOF')->nullable();
            $table->foreign('ArticleOF')->references('codeArticle')->on('articles')->restrictOnDelete();
            $table->integer('Qte_Conso');
            $table->integer('Qte_Chute');
           
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consommations');
    }
};
