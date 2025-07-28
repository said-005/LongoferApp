<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientsRequest extends FormRequest
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
        'Client'     => 'string|required',
        'codeClient' => 'string|required|unique:Clients,codeClient,' . $this->route('Client') . ',codeClient',
        'tele'       => 'min:10|nullable',
        'address'    => 'max:255|nullable',
        'email'      => 'email|nullable',
    ];
}

}
