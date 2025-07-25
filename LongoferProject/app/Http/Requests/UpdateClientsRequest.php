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
        'Client'     => 'string|max:50',
        'codeClient' => 'string|unique:Clients,codeClient,' . $this->route('Client') . ',codeClient',
        'tele'       => 'min:10|max:10',
        'address'    => 'max:255',
        'email'      => 'email',
    ];
}

}
