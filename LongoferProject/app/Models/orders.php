<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class orders extends Model
{
     public function of()
    {
        return $this->belongsTo(Of::class, 'code_of', 'codeOf');
    }
         public function clients()
    {
        return $this->belongsTo(clients::class, 'code_client', 'codeClient');
    }
}
