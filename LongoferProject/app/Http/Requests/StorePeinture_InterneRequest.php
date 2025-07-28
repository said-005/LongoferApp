<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePeinture_InterneRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Set to true to allow the request to proceed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code_Peinture_internes' => ['required', 'string', 'unique:peinture_internes,code_Peinture_internes'],
            'date_Peinture_Interne' => ['required', 'date'],
            'ref_production' => ['required', 'string', 'exists:productions,production_code'],
            'machine' => ['required', 'string'],
            'statut' => ['required', 'string'],
            'defaut' => ['nullable', 'string'],
            'causse' => ['nullable', 'string'],
            'operateur' => ['required', 'string'],
            'soudeur' => ['required', 'string'],
            'controleur' => ['required', 'string'],
            'description'       =>'nullable|string',
        ];
    }
}
