<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consommation extends Model
{
    /** @use HasFactory<\Database\Factories\ConsommationFactory> */
    use HasFactory;
  protected $fillable=[
'ArticleMatiere',
'Date',
'Num_LotOF',
'OF',
'ArticleOF',
'Qte_Conso',
'Qte_Chute'
  ];
  protected $hidden=[
   'created_at',
   'updated_at',
   'deleted_at'
  ];
}
