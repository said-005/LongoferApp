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
        Schema::create('articles', function (Blueprint $table) {
       
            $table->string('codeArticle',255)->primary();
            $table->string('ArticleName');
            $table->string('Unite_Stock');
            $table->float('Poids');
            $table->float('Diametre');
            $table->float('Epaisseur');
            $table->string('categorie', 255);
            $table->foreign('categorie')
                  ->references('CategorieArticle')
                  ->on('categorie_articles')
                  ->onDelete('restrict');
              
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
