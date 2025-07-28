<?php

namespace App\Http\Requests;
use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSablage_ExterneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
         'code_Sablage_Externe' => [
            'required',
            'string',
            Rule::unique('sablage_externes', 'code_Sablage_Externe')
                ->ignore($this->code_Sablage_Externe, 'code_Sablage_Externe'),
        ],
            'date_Sablage_Externe' => ['required', 'date'],
            'ref_production'       => ['nullable', 'string'],
            'machine'              => ['required', 'string'],
            'statut'               => ['required', 'string'],
            'defaut'               => ['nullable', 'string'],
            'causse'               => ['nullable', 'string'],
            'operateur'            => ['nullable', 'string'],
            'soudeur'              => ['nullable', 'string'],
            'controleur'           => ['nullable', 'string'],
            'description'       =>'nullable|string',
        ];
    }
}
