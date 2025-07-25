<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TubeStatut extends Model
{
    /** @use HasFactory<\Database\Factories\TubeStatusFactory> */
    use HasFactory;
         protected $keyType = 'string'; 
    public $incrementing = false;
         protected $primaryKey = 'Statut';
    protected $fillable=[
        'Statut'
    ];
      protected $hidden=[
   'created_at',
   'updated_at'
  ];
}
