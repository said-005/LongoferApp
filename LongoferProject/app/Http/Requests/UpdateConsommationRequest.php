<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConsommationRequest extends FormRequest
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
        'ArticleMatiere' => 'required|string',
        'Date' => 'required|date',
        'Num_LotOF' => 'required|string',
        'OF' => 'required|string',
        'ArticleOF' => 'string|nullable',
        'Qte_Conso' => 'required|numeric',
        'Qte_Chute' => 'required|numeric'
        ];
    }
}
