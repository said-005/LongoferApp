<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategorieArticle extends Model
{
    use HasFactory;

    protected $table = 'categorie_articles'; // optional: define if table name doesn't follow Laravel's naming
    protected $primaryKey = 'CategorieArticle'; // custom primary key
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'CategorieArticle'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function artical()
    {
        return $this->hasMany(Articles::class, 'categorie', 'CategorieArticle');
    }
}
