<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;  // Update this if you add auth logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'production_code' => 'required|string|unique:productions,production_code',
            'Num_OF'          => 'required|string',
            'ref_article'     => 'required|string|',
            'date_production' => 'required|date',
            'qte_produite'    => 'required|integer|min:1',
            'machine'         => 'required|string|',
            'statut'          => 'required|string',
            'defaut'          => 'nullable|string|max:255',
            'causse'          => 'nullable|string|max:255',
            'operateur'       => 'required|string|',
            'soudeur'         => 'required|string|',
            'controleur'      => 'required|string|',
            'description'     =>'string|nullable'
        ];
    }
}
