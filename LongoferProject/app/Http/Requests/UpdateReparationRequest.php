<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReparationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code_Reparation' => [
                'required',
                'string',
                
                Rule::unique('reparations', 'code_Reparation')->ignore($this->route('Reparation'), 'code_Reparation'),
            ],
            'date_reparation' => 'sometimes|required|date',
            'ref_production' => 'required|string',
            'machine' => 'sometimes|required|string|',
            'statut' => 'sometimes|required|string',
            'defaut' => 'nullable|string|max:255',
            'causse' => 'nullable|string|max:255',
            'operateur' => 'sometimes|required|string',
            'soudeur' => 'nullable|string|',
            'controleur' => 'nullable|string',
            'description'       =>'nullable|string',
        ];
    }
}
