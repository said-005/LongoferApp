<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Causses extends Model
{
     protected $primaryKey = 'code_causse';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'code_causse',
        'causse'
        
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

}
