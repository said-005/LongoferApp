<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operateur extends Model
{
    /** @use HasFactory<\Database\Factories\OperatorFactory> */
    use HasFactory;
             protected $keyType = 'string'; 
    public $incrementing = false;
     protected $primaryKey = 'operateur';

      protected $fillable=[
'operateur',
'nom_complete',
'Fonction',
'Machine',
'tele'
  ];
  protected $hidden=[
   'created_at',
   'updated_at'
  ];
}
