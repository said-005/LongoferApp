<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOperateurRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'operateur'=>'required|string|unique:operateurs,operateur,' . $this->route('Operateur') . ',operateur',
            'nom_complete'=>'required|string',
            'Fonction'=>'string',
            'Machine'=>'nullable|string'
        ];
    }
}
