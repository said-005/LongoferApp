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
}
