<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSablage_ExterneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code_Sablage_Externe' => ['required', 'string', 'unique:sablage_externes,code_Sablage_Externe'],
            'date_Sablage_Externe' => ['required', 'date'],
            'ref_production'       => ['required', 'string'],
            'machine'              => ['required', 'string'],
            'statut'               => ['required', 'string'],
            'defaut'               => ['nullable', 'string'],
            'causse'               => ['nullable', 'string'],
            'operateur'            => ['required', 'string'],
            'soudeur'              => ['required', 'string'],
            'controleur'           => ['required', 'string'],
            'description'       =>'nullable|string',
        ];
    }
}
