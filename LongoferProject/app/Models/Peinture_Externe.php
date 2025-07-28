<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peinture_Externe extends Model
{
    /** @use HasFactory<\Database\Factories\PeintureExterneFactory> */
      use HasFactory;
         protected $keyType = 'string'; 
    public $incrementing = false;
      protected $table = 'peinture_externes';
     protected $primaryKey = 'code_Peinture_Externe';
  protected $fillable=[
'code_Peinture_Externe',
'date_Peinture_Externe',
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
