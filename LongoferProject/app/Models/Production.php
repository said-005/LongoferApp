<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Production extends Model
{
    /** @use HasFactory<\Database\Factories\ProductionFactory> */
    use HasFactory;
      protected $keyType = 'string'; 
    public $incrementing = false;
     protected $primaryKey = 'production_code';
  protected $fillable=[
'production_code',
'Num_OF',
'ref_article',
'date_production',
'qte_produite',
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
