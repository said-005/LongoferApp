<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emmanchement extends Model
{
    /** @use HasFactory<\Database\Factories\EmmanchementFactory> */
    use HasFactory;
         protected $keyType = 'string'; 
    public $incrementing = false;
      protected $table = 'emmanchements';
     protected $primaryKey = 'code_Emmanchement';
  protected $fillable=[
'code_Emmanchement',
'date_Emmanchement',
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
