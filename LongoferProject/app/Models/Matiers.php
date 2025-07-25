<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matiers extends Model
{
    protected $primaryKey = 'code_matiere';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'code_matiere',
        'matiere', 
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];
}
