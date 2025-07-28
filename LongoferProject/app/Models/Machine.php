<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Machine extends Model
{
    /** @use HasFactory<\Database\Factories\MachineFactory> */
    use HasFactory;
             protected $keyType = 'string'; 
    public $incrementing = false;
    protected $primaryKey = 'codeMachine';
  protected $fillable=[
'codeMachine',
'MachineName',
  ];
  protected $hidden=[
   'created_at',
   'updated_at'
  ];
    public function operateur()
    {
        return $this->hasMany(Operateur::class, 'Machine', 'codeMachine');
        // client_numero = clé étrangère dans la table "commandes"
        // numero_client = clé primaire dans la table "clients"
    }
}
