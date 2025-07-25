<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOfRequest extends FormRequest
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
    $codeOf = $this->route('OF'); // Route param should match what's in your route definition

    return [
        'codeOf' => 'required|string|unique:ofs,codeOf,' . $codeOf . ',codeOf',
        'client' => 'required|string',

        'Article_1' => 'required|string',
        'Article_2' => 'nullable|string',
        'Article_3' => 'nullable|string',
        'Article_4' => 'nullable|string',
        'Article_5' => 'nullable|string',

        'Date_OF' => 'required|date',
        'date_Prevue_Livraison' => 'required|date',

        'Revetement_Ext' => 'required|boolean',
        'Sablage_Ext' => 'required|boolean',
        'Sablage_Int' => 'required|boolean',
        'Revetement_Int' => 'required|boolean',
        'Manchette_ISO' => 'required|boolean',
    ];
}

}
