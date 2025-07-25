<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMatiersRequest extends FormRequest
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
    $currentCode = $this->route('Matiere'); // 'matiers' must match your route param name

    return [
        'code_matiere' => 'required|string|unique:matiers,code_matiere,' . $currentCode . ',code_matiere',
        'matiere' => 'required|string',
    ];
}


}
