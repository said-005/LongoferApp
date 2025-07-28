<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow update requests, modify as needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Assuming the route parameter is {production} holding the production_code
        $productionCode = $this->route('Production');

        return [
            'production_code' => [
                'required',
                'string',
                Rule::unique('productions', 'production_code')->ignore($productionCode, 'production_code'),
            ],
            'Num_OF'          => 'required|string|',
            'ref_article'     => 'required|string|',
            'date_production' => 'required|date',
            'qte_produite'    => 'required|integer|min:1',
            'machine'         => 'required|string|',
            'statut'          => 'required|string|',
            'defaut'          => 'nullable|string|max:255',
            'causse'          => 'nullable|string|max:255',
            'operateur'       => 'required|string|',
            'soudeur'         => 'required|string|',
            'controleur'      => 'required|string|',
            'description'     =>'string|nullable'
        ];
    }
}
