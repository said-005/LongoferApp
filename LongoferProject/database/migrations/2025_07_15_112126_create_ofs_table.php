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
        Schema::create('ofs', function (Blueprint $table) {
            $table->string('codeOf')->primary();

            // Foreign key to Clients
            $table->string('client');
            $table->foreign('client')->references('codeClient')->on('clients')->restrictOnDelete();

            // Foreign keys to Articles
            $table->string('Article_1',255);
            $table->foreign('Article_1')->references('codeArticle')->on('articles')->restrictOnDelete();

            $table->string('Article_2',255)->nullable();
            $table->foreign('Article_2')->references('codeArticle')->on('articles')->restrictOnDelete();

            $table->string('Article_3',255)->nullable();
            $table->foreign('Article_3')->references('codeArticle')->on('articles')->restrictOnDelete();

            $table->string('Article_4',255)->nullable();
            $table->foreign('Article_4')->references('codeArticle')->on('articles')->restrictOnDelete();

            $table->string('Article_5',255)->nullable();
            $table->foreign('Article_5')->references('codeArticle')->on('articles')->restrictOnDelete();

            $table->date('Date_OF');
            $table->date('date_Prevue_Livraison');

            // Processing Steps
            $table->boolean('Revetement_Ext');
            $table->boolean('Sablage_Ext');
            $table->boolean('Sablage_Int');
            $table->boolean('Revetement_Int');
            $table->boolean('Manchette_ISO');
         
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ofs');
    }
};
