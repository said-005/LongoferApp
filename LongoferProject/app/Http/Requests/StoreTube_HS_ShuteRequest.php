<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTube_HS_ShuteRequest extends FormRequest
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
        'code_tube_HS'=>'required|string|unique:tube_hs_shutes,code_tube_HS',
        'Article'=>'required|string',
        'OF'=>'required',
        'Date'=>'required|date',
        'Qte_Chute_HS'=>'required',
        ];
    }
}
