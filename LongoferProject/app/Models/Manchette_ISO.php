<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manchette_ISO extends Model
{
    /** @use HasFactory<\Database\Factories\ManchetteISOFactory> */
    use HasFactory;
         protected $keyType = 'string'; 
    public $incrementing = false;
      protected $table = 'manchette_isos';
     protected $primaryKey = 'code_Manchette';
  protected $fillable=[
'code_Manchette',
'date_Manchette',
'ref_production',
'machine',
'statut',
'defaut',
'causse',
'operateur',
'soudeur',
'controleur',
	'code_Reparation',
  'description'
  ];
  protected $hidden=[
   'created_at',
   'updated_at',

  ];
}
