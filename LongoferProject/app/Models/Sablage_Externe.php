<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sablage_Externe extends Model
{
    /** @use HasFactory<\Database\Factories\SablageExterneFactory> */
    use HasFactory;
         protected $keyType = 'string'; 
    public $incrementing = false;
     protected $table = 'sablage_externes';
    protected $primaryKey = 'code_Sablage_Externe';
protected $fillable=[
'code_Sablage_Externe',
'date_Sablage_Externe',
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
