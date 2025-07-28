<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peinture_Interne extends Model
{
    /** @use HasFactory<\Database\Factories\PeintureInterneFactory> */
    use HasFactory;
         protected $keyType = 'string'; 
    public $incrementing = false;
      protected $table = 'peinture_internes';
     protected $primaryKey = 'code_Peinture_internes';
  protected $fillable=[
'code_Peinture_internes',
'date_Peinture_Interne',
'ref_production',
'machine',
'statut',
'defaut',
'causse',
'operateur',
'soudeur',
'controleur',
'description'
  ];
  protected $hidden=[
   'created_at',
   'updated_at',
   'deleted_at'
  ];
}
