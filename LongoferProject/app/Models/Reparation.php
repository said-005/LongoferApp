<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reparation extends Model
{
    /** @use HasFactory<\Database\Factories\ReparationFactory> */
    use HasFactory;
     protected $keyType = 'string'; 
    public $incrementing = false;
     protected $primaryKey = 'code_Reparation';
  protected $fillable=[
'code_Reparation',
'date_reparation',
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
