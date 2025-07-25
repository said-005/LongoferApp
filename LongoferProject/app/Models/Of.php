<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Of extends Model
{
    /** @use HasFactory<\Database\Factories\OfFactory> */
    use HasFactory;
             protected $keyType = 'string'; 
    public $incrementing = false;
     protected $primaryKey = 'codeOf';
      public function orders()
    {
        return $this->hasMany(orders::class, 'code_of', 'codeOf');
    }
    protected $hidden=[
      'updated_at',
      'created_at'
    ];
    protected $fillable=[
    "codeOf",
  "client",
  "Article_1",
  "Article_2",
  "Article_3",
  "Article_4",
  "Article_5",
  "Date_OF",
  "date_Prevue_Livraison",
  "Revetement_Ext",
  "Sablage_Ext",
  "Sablage_Int",
  "Revetement_Int",
  "Manchette_ISO"
    ];
}
