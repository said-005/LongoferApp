<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tube_HS_Shute extends Model
{
    use HasFactory;

    protected $table = 'tube_hs_shutes'; // Ensure this matches your actual table name

   

    protected $fillable = [
        'ref_production',
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
