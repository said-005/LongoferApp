<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Defaut extends Model
{
    use HasFactory;

    protected $primaryKey = 'codeDefaut';
    protected $keyType = 'string';
    public $incrementing = false;

protected $fillable = [
    'codeDefaut',
    'defautDescription',
];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}

