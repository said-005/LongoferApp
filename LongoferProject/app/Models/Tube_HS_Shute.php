<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tube_HS_Shute extends Model
{
    use HasFactory;

    protected $table = 'tube_hs_shutes'; // Ensure this matches your actual table name

    protected $primaryKey = 'code_tube_HS'; // Custom primary key
    protected $keyType = 'string'; // Since the primary key is not an integer
    public $incrementing = false; // No auto-incrementing

    protected $fillable = [
        'code_tube_HS',
        'Article',
        'OF',
        'Date',
        'Qte_Chute_HS',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
