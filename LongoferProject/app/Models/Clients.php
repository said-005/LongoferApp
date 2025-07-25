<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clients extends Model
{
    /** @use HasFactory<\Database\Factories\ClientsFactory> */
    use HasFactory;
     protected $keyType = 'string'; 
    public $incrementing = false;
     protected $primaryKey = 'codeClient';
  protected $fillable=[
'address',
'Client',
'codeClient',
'email',
'tele'
  ];
  protected $hidden=[
   'created_at',
   'updated_at'
  ];
         public function orders()
    {
        return $this->hasMany(orders::class, 'code_client', 'codeClient');
    }
}
