<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Articles extends Model
{
    use HasFactory;

    protected $primaryKey = 'codeArticle';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'codeArticle',
        'ArticleName',
        'Unite_Stock',
        'Poids',
        'Diametre',
        'Epaisseur',
        'categorie',
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function categorie()
    {
        return $this->belongsTo(CategorieArticle::class, 'categorie', 'CategorieArticle');
    }
}
