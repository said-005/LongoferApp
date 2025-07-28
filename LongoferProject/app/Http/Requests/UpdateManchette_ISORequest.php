<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateManchette_ISORequest extends FormRequest
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
           $code = $this->route('Manchette'); // Assuming route model binding
      return [
            'code_Manchette' => [
                'required',
                'string',
                Rule::unique('manchette_isos', 'code_Manchette')->ignore($code, 'code_Manchette')
            ],
            'date_Manchette' => ['required', 'date'],
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
