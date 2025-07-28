<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sablage_Interne extends Model
{
    /** @use HasFactory<\Database\Factories\SablageInterneFactory> */
   use HasFactory; 
  protected $table = 'sablage_internes';
     protected $keyType = 'string'; 
    public $incrementing = false;
     protected $primaryKey = 'code_Sablage_Interne';
      
  protected $fillable=[
'code_Sablage_Interne',
'date_Sablage_Interne',
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
  
  ];
}
