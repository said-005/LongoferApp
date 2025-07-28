<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operateur extends Model
{
    /** @use HasFactory<\Database\Factories\OperatorFactory> */
    use HasFactory;
             protected $keyType = 'string'; 
    public $incrementing = false;
     protected $primaryKey = 'operateur';

      protected $fillable=[
'operateur',
'nom_complete',
'Fonction',
'Machine',
'tele'
  ];
  protected $hidden=[
   'created_at',
   'updated_at'
  ];
    public function machine()
    {
        return $this->belongsTo(Machine::class, 'Machine', 'codeMachine');
        // client_numero = clé étrangère dans la table "commandes"
        // numero_client = clé primaire dans la table "clients"
    }
}
