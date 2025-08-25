<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTableRequest extends FormRequest
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
            'number' => 'required|string|unique:tables,number|max:10',
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1|max:20',
            'is_available' => 'boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'number.required' => 'Table number is required.',
            'number.unique' => 'This table number already exists.',
            'name.required' => 'Table name is required.',
            'capacity.required' => 'Table capacity is required.',
            'capacity.min' => 'Table capacity must be at least 1.',
            'capacity.max' => 'Table capacity cannot exceed 20.',
        ];
    }
}