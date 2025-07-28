<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReparationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow request
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
       'code_Reparation' => 'required|string|max:155|unique:reparations,code_Reparation',

            'date_reparation' => 'required|date',
           'ref_production' => 'required|string',
            'machine' => 'required|string|',
            'statut' => 'required|string',
            'defaut' => 'nullable|string|max:255',
            'causse' => 'nullable|string|max:255',
            'operateur' => 'required|string|',
            'soudeur' => 'nullable|string|',
            'controleur' => 'nullable|string|',
            'description'       =>'nullable|string',
        ];
    }
}
